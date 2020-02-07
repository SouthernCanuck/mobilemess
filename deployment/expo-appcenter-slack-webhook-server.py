#!/usr/bin/python3 -u

from flask import Flask, request
import requests
import json
import redis
import pickle
import os
import sys
import dotenv


def check_envs():
    for env in 'ORG_NAME APPCENTER_TOKEN ANDRDOID_TEAM_ID IOS_TEAM_ID SLACK_TOKEN SLACK_CHANNEL'.split():
        if env not in os.environ:
            app.logger.info('{} not defined'.format(env))
            sys.exit(1)


def redis_add_to_queue(regID, regData):
    pRegData = pickle.dumps(regData)
    try:
        r.set(regID, pRegData)
        app.logger.info(f'Request added to redis queue for id: {regID}, platform {regData["platform"]}, build number {regData["buildNumber"]}.')
    except redis.exceptions.ConnectionError as e:
        app.logger.info(f'Could not add request with id: {regID}, platform {regData["platform"]}, build number {regData["buildNumber"]}.')
        raise


def redis_extract_from_queue(regID):
    keys = r.keys()
    if len(keys) == 0:
        return {}
    for rKey in keys:
        key = rKey.decode('utf-8')
        if key == regID:
            pRegData = r.get(rKey)
            regData = pickle.loads(pRegData)
            r.delete(key)
            return regData
    return {}


def redis_show_queue():
    queue = {}
    keys = r.keys()
    if len(keys) == 0:
        return queue
    for rKey in keys:
        key = rKey.decode('utf-8')
        pRegData = r.get(rKey)
        regData = pickle.loads(pRegData)
        queue[key] = regData
    return queue


def slack_notify(buildNum, status, platform, artURL):
    slackToken = os.getenv('SLACK_TOKEN')
    slackChannel = os.getenv('SLACK_CHANNEL')
    msg = f'Build CircleCI number {buildNum}, platform {platform} {status}, artifact URL: {artURL}'
    requests.post('https://slack.com/api/chat.postMessage', data = { "token": slackToken, "channel": slackChannel, "text": msg })
    return


def appcenter_upload(platform, artUrl, uuid, notes):
    AC_HEADERS = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Token": os.getenv('APPCENTER_TOKEN')
    }
    APP_NAME = 'Firstam-Inspection-Android' if platform == 'android' else 'Firstam-Inspection-iOS'
    groupId = os.getenv('ANDRDOID_TEAM_ID') if platform == 'android' else os.getenv('IOS_TEAM_ID')
    FTYPE = 'apk' if platform == 'android' else 'ipa'
    TMPF = f'/tmp/{uuid}.{FTYPE}'
    API = f'https://api.appcenter.ms/v0.1/apps/{os.getenv("ORG_NAME")}/{APP_NAME}'
    app.logger.info(f'Running build download/upload:\n {platform},\n {artUrl},\n {uuid},\n {notes}')
    app.logger.info('Download build from expo')
    response = requests.get(artUrl)
    with open(TMPF, 'wb') as f:
        f.write(response.content)
    app.logger.info('Create release resource')
    responseJson = requests.post(headers=AC_HEADERS, url=f'{API}/release_uploads').json()
    app.logger.info(json.dumps(responseJson, indent=4))
    uploadUrl = responseJson['upload_url']
    uploadId = responseJson['upload_id']
    app.logger.info('Upload build')
    requests.post(url=uploadUrl, files={ 'ipa': (TMPF, open(TMPF,'rb'))})
    os.remove(TMPF)
    app.logger.info('Release build')
    responseJson = requests.patch(headers=AC_HEADERS, url=f'{API}/release_uploads/{uploadId}', json={ "status": "committed" }).json()
    app.logger.info(json.dumps(responseJson, indent=4))
    app.logger.info('Patch with release notes')
    releaseId = responseJson['release_id']
    responseJson = requests.patch(headers=AC_HEADERS, url=f'{API}/releases/{releaseId}', json={ "release_notes": notes }).json()
    app.logger.info(json.dumps(responseJson, indent=4))
    app.logger.info('Assing group')
    responseJson = requests.post(headers=AC_HEADERS, url=f'{API}/releases/{releaseId}/groups', json={ "id": groupId,
        "mandatory_update": False,
        "notify_testers": False }).json()
    app.logger.info(json.dumps(responseJson, indent=4))


dotenv.load_dotenv()
check_envs()
app = Flask(__name__)
r = redis.Redis(host='127.0.0.1', port=6379, db=0)


@app.route('/', methods=['GET'])
def hello():
    return json.dumps(redis_show_queue(),indent=4)


@app.route('/register', methods=['POST'])
def register():
    reqData = request.get_json()
    regID = reqData['id']
    regData = {}
    regData['platform'] = reqData['platform']
    regData['buildNumber'] = reqData['buildNumber']
    regData['notes'] = reqData['notes']
    redis_add_to_queue(regID, regData)
    return 'OK\n'
  

@app.route('/webhook', methods=['POST'])
def webhook():
    reqData = request.get_json()
    regID = reqData['id']
    app.logger.info(f'Received webhook of {regID} ID')
    regData = redis_extract_from_queue(regID)
    if not regData:
        app.logger.info(f'ID {regID} not found in registered requests')
        return 'OK\n'
    reqStatus = reqData['status']
    app.logger.info(f'Build ID {regID} {reqStatus}')
    app.logger.info(f'Notifying slack with:')
    app.logger.info(json.dumps(regData, indent=4))
    if reqStatus == 'finished':
        appcenter_upload(regData['platform'], reqData['artifactUrl'], regID, regData['notes'])
        slack_notify(regData['buildNumber'], 'successful', regData['platform'], reqData['artifactUrl'])
    else:
        slack_notify(regData['buildNumber'], 'failed', regData['platform'], 'none')
    return 'OK\n'


app.run(host='0.0.0.0', port=3000, threaded=True, debug=True)

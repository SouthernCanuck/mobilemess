import React, { useReducer, useContext } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import posed, { Transition } from 'react-native-pose';
import { Entypo as Icon } from '@expo/vector-icons';

import dimensions from 'styles/dimensions';
import colors from 'styles/colors';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    bottom: dimensions.spacing,
    left: 0,
    alignItems: 'center',
  },
  toast: {
    position: 'relative',
    minWidth: 200,
    maxWidth: Dimensions.get('window').width / 2,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginBottom: dimensions.spacing,
    paddingVertical: dimensions.spacing,
    paddingHorizontal: dimensions.spacing * 2,
    borderRadius: 200,
    backgroundColor: colors.yellow,
  },
  toastText: {
    color: colors.white,
    marginLeft: dimensions.spacing * 2,
  },
  toastProgress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    backgroundColor: colors.whiteOpaque,
  },
});

enum ActionTypes {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum ToastLevels {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

type Id = number;
type Content = string;

type Toast = {
  id: Id;
  content: Content;
  level: ToastLevels;
  duration: number;
};

type ToastAction =
 | { type: ActionTypes.ADD} & Toast
 | { type: ActionTypes.REMOVE; id: Id };

type RemoveToast = (id: Id) => void;
export type AddToast = (content: Content, level?: ToastLevels, duration?: number) => void;

type ToasterContextType = { addToast: AddToast };
const ToasterContext = React.createContext<ToasterContextType>({ addToast: () => {} });

const getColor = (level: ToastLevels) => {
  switch (level) {
    case ToastLevels.WARN:
      return colors.yellow;

    case ToastLevels.ERROR:
      return colors.red;

    case ToastLevels.INFO:
    default:
      return colors.blue;
  }
};

const ToastIcon: React.FC<{ level: ToastLevels}> = ({ level }) => (
  <Icon
    name={level === ToastLevels.WARN || level === ToastLevels.ERROR ? 'warning' : 'info'}
    color={colors.white}
  />
);

const ToastAnimation = posed.View({
  init: {
    opacity: 0,
    y: 50,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 150,
      ease: 'easeOut',
    },
  },
});

const ToastProgress = posed.View({
  init: {
    scaleX: 1,
  },
  enter: {
    scaleX: 0,
    transition: ({ duration }: Pick<Toast, 'duration'>) => ({
      duration,
      ease: 'easeOut',
    }),
  },
  exit: {
    scaleX: 0,
  },
});

const toastReducer = (state: Toast[], action: ToastAction): Array<Toast> => {
  switch (action.type) {
    case ActionTypes.ADD:
      return [
        ...state,
        {
          id: action.id,
          content: action.content,
          level: action.level,
          duration: action.duration,
        },
      ];

    case ActionTypes.REMOVE:
      return state.filter(toast => toast.id !== action.id);

    default:
      return state;
  }
};

let uid = 0;
const timers: { [index: string]: ReturnType<typeof setTimeout> } = {};

const startTimer = (
  id: Id,
  removeToast: RemoveToast,
  delay: number,
) => {
  if (!timers[id]) {
    timers[id] = setTimeout(() => removeToast(id), delay);
  }
};

const dismiss = (id: Id, removeToast: RemoveToast) => {
  if (timers[id]) {
    clearTimeout(timers[id]);
    delete timers[id];
  }
  removeToast(id);
};

interface ToasterActions {
  addToast: AddToast;
}
export const ToasterActions: ToasterActions = {
  addToast: () => { console.info('Toaster not yet mounted'); },
};

const Toaster: React.FC = ({ children }) => {
  const [toastList, dispatch] = useReducer(toastReducer, []);
  const removeToast: RemoveToast = id => dispatch({ type: ActionTypes.REMOVE, id });

  const addToast: AddToast = (content, level = ToastLevels.INFO, duration = 6000) => {
    uid += 1;
    startTimer(uid, removeToast, duration);
    dispatch({
      type: ActionTypes.ADD,
      id: uid,
      content,
      level,
      duration,
    });
  };

  ToasterActions.addToast = addToast;

  return (
    <>
      <ToasterContext.Provider value={{ addToast }}>
        {children}
      </ToasterContext.Provider>
      <View style={styles.container}>
        <Transition preEnterPose="init">
          {toastList.map(({
            id, content, level, duration,
          }: Toast) => {
            const remove = () => dismiss(id, removeToast);

            return (
              <ToastAnimation key={id}>
                <TouchableOpacity onPress={remove}>
                  <View style={[styles.toast, { backgroundColor: getColor(level) }]}>
                    <ToastIcon level={level} />
                    <Text style={styles.toastText}>{content}</Text>
                    <ToastProgress duration={duration} initialPose="init" style={styles.toastProgress} />
                  </View>
                </TouchableOpacity>
              </ToastAnimation>
            );
          })}
        </Transition>
      </View>
    </>
  );
};

export default Toaster;

export type WithToasterProps = {
  addToast: AddToast;
}

export const withToaster = <P extends object>(
  Component: React.ComponentType<P>,
) => (props: P) => {
  const { addToast } = useContext(ToasterContext);
  return <Component addToast={addToast} {...props as P} />;
};

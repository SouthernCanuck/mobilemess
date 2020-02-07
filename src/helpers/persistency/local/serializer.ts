import { fileDBName } from 'constants/fileDB';
import { saveJsonFile } from 'helpers/fileSystem';
import { ReadData } from './types';
import { PersistentData } from './v7loader';

export default function* save(data: ReadData) {
  const content: PersistentData = {
    version: 7,
    orders: data.orders.map(({ order, sketch }) => ({
      order: {
        ...order,
        appointment: order.appointment.toISOString(),
        dueDate: order.dueDate.toISOString(),
        expiration: order.expiration ? order.expiration.toISOString() : undefined,
      },
      sketch,
    })),
  };
  yield saveJsonFile(fileDBName, content);
}

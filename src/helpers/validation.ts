import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { fold } from 'fp-ts/lib/Either';

export default function createValidator<T>(type: t.Type<T>) {
  return (data: any): T => {
    const validation = type.decode(data);
    return fold(
      () => {
        console.warn(PathReporter.report(validation));
        throw new Error(PathReporter.report(validation).join('. '));
      },
      (value: T) => value,
    )(validation);
  };
}

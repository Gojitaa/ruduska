class Result<V, E extends Error> {
  private readonly state?: V;
  private readonly error?: E;
  private readonly isOk: boolean;

  private constructor(isOk: boolean, value?: V, error?: E) {
    this.state = value;
    this.error = error;
    this.isOk = isOk;
  }

  static Ok<V>(value: V) {
    return new Result<V, never>(true, value, undefined);
  }

  static Err<E extends Error>(error: E) {
    return new Result<never, E>(false, undefined, error);
  }

  unwrapOrElse<U>(errorHandler: (error: E) => U) {
    if (this.isOk) {
      return this.state as V;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return errorHandler(this.error!);
  }

  map<V2, E extends Error>(handler: (value: V) => V2): Result<V2, E>;
  map(handler: (value: V) => V): Result<V, E> {
    if (this.isOk && this.state != null) {
      return Result.Ok(handler(this.state));
    }

    return this;
  }

  mapErr<E2 extends Error>(handler: (error: E) => E2): Result<V, E2>;
  mapErr(handler: (error: E) => E): Result<V, E> {
    if (this.isOk && this.state != null) {
      return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Result.Err(handler(this.error!));
  }

  andThen<V2>(handler: (value: V) => Result<V2, E>): Result<V2, E>;
  andThen<E2 extends Error>(
    handler: (value: V) => Result<V, E2>,
  ): Result<V, E2>;
  andThen<V2, E2 extends Error>(
    handler: (value: V) => Result<V2, E | E2>,
  ): Result<V2, E | E2>;
  andThen<V2, E2 extends Error>(handler: (value: V) => Result<V2, E | E2>) {
    if (this.isOk && this.state != null) {
      return handler(this.state);
    }

    return this;
  }
}

export function tryCatch<V, E extends Error>(
  successHandler: () => V,
): Result<V, E> {
  try {
    return Result.Ok(successHandler());
  } catch (e: unknown) {
    return Result.Err(e as E);
  }
}

export async function async<V, E extends Error>(
  successHandler: () => Promise<V>,
): Promise<Result<V, E>> {
  try {
    return successHandler()
      .then((val: V) => Result.Ok(val))
      .catch((error: E) => Result.Err(error));
  } catch (e) {
    return Promise.resolve(Result.Err(e as E));
  }
}

export default Result;

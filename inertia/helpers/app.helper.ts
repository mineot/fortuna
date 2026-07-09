export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export type Payload = Record<string, unknown>;
export type ListParams = Record<string, string>;
export type Pagination = { page?: number; limit?: number };

export type Meta = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
};

type ListResponse<T> = {
  data: T;
  meta: Meta;
};

type OptionArgs = {
  t?: (key: string) => string;
};

type MergeArgs = {
  url: string;
  payload: Payload;
  options?: OptionArgs;
};

type ListArgs = {
  url: string;
  key: string;
  params?: ListParams;
  pagination?: Pagination;
  options?: OptionArgs;
};

function getGenericMessage(options?: OptionArgs): string {
  return options?.t?.('app.terms.error_occurred') || 'Unexpected error occurred';
}

function getErrorMessage(body: unknown, genericMessage: string, context: string): Error {
  let message = '';

  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    const errors = obj.errors;

    if (Array.isArray(errors) && errors[0] && typeof errors[0].message === 'string') {
      message = errors[0].message;
    }

    if (!message && typeof obj.message === 'string') {
      message = obj.message;
    }
  }

  return new Error(`${context}: ${message || genericMessage}`);
}

function throwError(error: unknown, genericMessage: string, context: string): Error {
  const message =
    typeof error === 'string' ? error : error instanceof Error ? error.message : genericMessage;

  const err = new Error(`${context}: ${message}`);

  if (error instanceof Error) {
    err.cause = error;
  }

  console.error(context, error);
  return err;
}

const REQUEST_TIMEOUT = 15_000;

function getAbortSignal(timeout = REQUEST_TIMEOUT): AbortSignal {
  return AbortSignal.timeout(timeout);
}

function makeUrl(url: string, parameters?: ListParams, pagination?: Pagination): string {
  const builder = new URLSearchParams();

  if (parameters) {
    Object.entries(parameters).forEach(([key, value]) => {
      builder.append(key, value);
    });
  }

  if (pagination?.limit) {
    builder.append('limit', String(pagination.limit));
  }

  if (pagination?.page) {
    builder.append('page', String(pagination.page));
  }

  return builder.size ? `${url}?${builder.toString()}` : url;
}

export function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    throw new Error('API Helper - CSRF: Invalid XSRF-TOKEN cookie value');
  }
}

export function getCsrfHeader() {
  const csrfToken = getCsrfToken();

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
  };
}

function getCsrfGetHeader() {
  const csrfToken = getCsrfToken();

  return {
    Accept: 'application/json',
    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
  };
}

export async function merge<T>({ url, payload, options }: MergeArgs): Promise<T> {
  const genericMessage = getGenericMessage(options);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: getCsrfHeader(),
      signal: getAbortSignal(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw getErrorMessage(body, genericMessage, 'API Helper - Merge');
    }

    const body = await response.json();
    return body.data as T;
  } catch (error) {
    throw throwError(error, genericMessage, 'API Helper - Merge');
  }
}

export async function list<T>(args: ListArgs): Promise<ListResponse<T>> {
  const { url, key, params: parameters, pagination, options } = args;
  const genericMessage = getGenericMessage(options);

  try {
    const response = await fetch(makeUrl(url, parameters, pagination), {
      method: 'GET',
      credentials: 'include',
      headers: getCsrfGetHeader(),
      signal: getAbortSignal(),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw getErrorMessage(body, genericMessage, 'API Helper - List');
    }

    const body = await response.json();
    const entry = body[key];

    return {
      data: (entry?.data as T) ?? ([] as unknown as T),
      meta: (entry?.meta as Meta) ?? ({} as Meta),
    };
  } catch (error) {
    throw throwError(error, genericMessage, 'API Helper - List');
  }
}

// type ResponseStatus = 'ERROR' | 'SUCCESS';
// type Response<T> = { status: ResponseStatus; message: string; data?: T };

// type FindByIdArgs = { url: string; id: number; useCredential?: boolean; t: TFunction };
// type ArchiveArgs = { url: string; id: number; t: TFunction };

// export async function findById<T>(args: FindByIdArgs): Promise<Response<T>> {
//   const { url, id, useCredential, t } = args;

//   try {
//     const options: RequestInit = useCredential
//       ? { credentials: 'include', headers: getCsrfHeader() }
//       : { headers: { Accept: 'application/json' } };

//     const response = await fetch(`${url}/${id}`, options);

//     if (!response.ok) {
//       const body = await response.json().catch(() => ({}));
//       return { status: 'ERROR', message: body.message };
//     }

//     const body = await response.json();
//     return { status: 'SUCCESS', message: body.message, data: body.data as T };
//   } catch (error) {
//     return {
//       status: 'ERROR',
//       message: error instanceof Error ? error.message : t('app.terms.error_unexpected'),
//     };
//   }
// }

// export async function archive<T>(args: ArchiveArgs): Promise<Response<T>> {
//   const { url, id, t } = args;

//   try {
//     const response = await fetch(`${url}/${id}/archive`, {
//       method: 'PATCH',
//       credentials: 'include',
//       headers: getCsrfHeader(),
//     });

//     if (!response.ok) {
//       const body = await response.json().catch(() => ({}));
//       return { status: 'ERROR', message: body.message };
//     }

//     const body = await response.json();
//     return { status: 'SUCCESS', message: body.message, data: body.data as T };
//   } catch (error) {
//     return {
//       status: 'ERROR',
//       message: error instanceof Error ? error.message : t('app.terms.error_unexpected'),
//     };
//   }
// }

// export async function update<T>(url: string, id: number, body: any): Promise<Response<T>> {
//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       credentials: 'include',
//       headers: getCsrfHeader(),
//       body,
//     });

//     if (!response.ok) {
//       const json = await response.json().catch(() => ({}));

//       return {
//         status: 'ERROR',
//         message: json.message,
//       };
//     }

//     const json = await response.json();

//     return {
//       status: 'SUCCESS',
//       message: json.message,
//       data: json.data as T,
//     };
//   } catch (error) {
//     throw error;
//   }
// }

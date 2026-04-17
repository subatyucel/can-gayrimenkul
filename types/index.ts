type DefaultSearchParams = Record<string, string | string[] | undefined>;

export type NextPageProps<T = DefaultSearchParams> = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<T>;
};

export type ActionResponse<T = void> =
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

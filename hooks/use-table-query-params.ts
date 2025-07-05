import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface Props<T extends Object> {
  fields: (keyof T)[];
  initialize: () => T;
}

const useTableQueryParams = <T extends Object>({
  fields,
  initialize,
}: Props<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to get a query parameter value
  const getQueryParam = useCallback(
    (key: string) => {
      return searchParams?.get(key) || initialize()[key as keyof T] || null;
    },
    [searchParams, initialize],
  );

  // Create a memoized state of query parameters
  const queryParamState = useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        acc[field] = getQueryParam(field as string) as string | null;
        return acc;
      },
      {} as Record<keyof T, string | null>,
    );
  }, [fields, getQueryParam]); // Depend on `fields` and `searchParams`

  const isDirty = useMemo(() => {
    return fields.some((field) => queryParamState[field] !== null);
  }, [fields, queryParamState]);

  // Function to update multiple query parameters
  const updateQueryParams = (
    params:
      | Partial<Record<keyof T, string | null>>
      | ((
          prev: Record<keyof T, string | null>,
        ) => Partial<Record<keyof T, string | null>>),
  ) => {
    const currentParams = new URLSearchParams(searchParams?.toString());

    // Determine the new parameters based on whether a function or object is passed
    const newParamsObject =
      typeof params === "function"
        ? params(
            Object.fromEntries(currentParams.entries()) as Record<
              keyof T,
              string | null
            >,
          )
        : params;

    Object.entries(newParamsObject).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });

    router.replace(`${window.location.pathname}?${currentParams.toString()}`, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams?.toString());
    fields.forEach((field) => {
      newParams.delete(field as string);
    });

    router.replace(`${window.location.pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  /**
   * Niche Helper Functions ==================================================
   */

  type HasProperty<T, K extends string> = K extends keyof T ? true : false;

  const checkValidPageName = (pageName?: string) => {
    if (pageName && !fields.includes(pageName as keyof T)) {
      throw new Error(`${pageName} is not included in the \`fields\` array.`);
    }
  };

  const checkValidDateFields = (pageName?: string) => {
    checkValidPageName(pageName);
    if (
      !(
        "startDate" in queryParamState &&
        "endDate" in queryParamState &&
        "dateType" in queryParamState
      )
    ) {
      throw new Error(
        "`startDate`, `endDate`, and `dateType` must be included in the `fields` array.",
      );
    }
  };

  const parseStringArray = (value: string | null) => {
    return value ? value.split(",") : [];
  };

  const setStringArray = (
    key: keyof T,
    value: string[],
    resetPageName?: string,
  ) => {
    checkValidPageName(resetPageName);
    updateQueryParams((prev) => {
      const returnObj: { [key: string]: any } = {
        ...prev,
        [key]: value.join(","),
      };
      if (resetPageName) {
        returnObj[resetPageName] = "1";
      }
      return returnObj as Record<keyof T, string | null>;
    });
  };

  const parseNumValue = (value: string | null, fallback: number) => {
    return value ? parseInt(value) : fallback;
  };

  const setNumValue = (key: keyof T, value: number, resetPageName?: string) => {
    checkValidPageName(resetPageName);
    updateQueryParams((prev) => {
      const returnObj: { [key: string]: any } = {
        ...prev,
        [key]: value.toString(),
      };
      if (resetPageName) {
        returnObj[resetPageName] = "1";
      }
      return returnObj as Record<keyof T, string | null>;
    });
  };

  return {
    queryParamState,
    updateQueryParams,
    isDirty,
    clearFilters,
    parseStringArray,
    setStringArray,
    parseNumValue,
    setNumValue,
  };
};

export default useTableQueryParams;

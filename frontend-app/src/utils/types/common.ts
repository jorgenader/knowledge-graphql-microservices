import { ExecutionResult, MutationFunctionOptions } from '@apollo/react-common';

export interface ObjectMap<T = any> {
    [key: string]: T;
}

export type MutationFn<TData, TVariables> = (
    options?: MutationFunctionOptions<TData, TVariables>
) => Promise<ExecutionResult<TData>>;

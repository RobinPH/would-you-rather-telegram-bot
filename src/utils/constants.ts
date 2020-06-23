export enum EXAMPLE {
  ONE = `Example: Would you rather *be free* or *be totally safe*?`,
  TWO = `Example: *Be free* or *be totally safe*?`,
}

export const FORMAT = `Format: "Option1 or Option2"`;
export const SUGGESTION = `*Suggest New Would Your Rather Question.* \n  ${ FORMAT } \n  ${ EXAMPLE.ONE } \n  ${ EXAMPLE.TWO } \n\n_Reply to this Message._`;
export const INVALID = `*Invalid Suggestion Format* \n  ${ FORMAT } \n  ${ EXAMPLE.ONE } \n  ${ EXAMPLE.TWO }`;
export const ADDED_SUCCESSFUL = `*Added new Would You Rather question.*`;
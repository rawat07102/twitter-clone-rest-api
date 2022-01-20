type subNewMessageFilter = (
  payload: { chatId: string },
  variables: { chatId: string },
) => boolean

export const subNewMessageFilter: subNewMessageFilter = (payload, variables) =>
  payload.chatId === variables.chatId

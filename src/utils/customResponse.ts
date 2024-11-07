enum MessageType {
  NONE = 'NONE',
  DIALOG = 'DIALOG',
  TOAST = 'TOAST',
}

export class Message {
  message?: string
  error?: boolean
  show?: MessageType

  constructor(
    message: string = 'ok',
    error: boolean = false,
    show: MessageType = MessageType.NONE,
  ) {
    this.error = error
    this.show = show
    this.message = message
  }
}

export class CustomResponse {
  message: Message;
  [key: string]: any // Index signature

  constructor(
    message: Message = new Message(),
    additionalFields?: { [key: string]: any },
  ) {
    this.message = message

    if (additionalFields) {
      Object.keys(additionalFields).forEach((key) => {
        this[key] = additionalFields[key]
      })
    }
  }
}

enum MessageType {
  NONE = 'NONE',
  DIALOG = 'DIALOG',
  TOAST = 'TOAST',
}

export class Message {
  message?: string
  show?: MessageType

  constructor(message: string = 'ok', show: MessageType = MessageType.NONE) {
    this.show = show
    this.message = message
  }
}

export class CustomResponse {
  message: Message
  error: boolean;
  [key: string]: any // Index signature

  constructor(
    additionalFields?: { [key: string]: any },
    message: Message = new Message(),
    error: boolean = false,
  ) {
    this.message = message
    this.error = error

    if (additionalFields) {
      Object.keys(additionalFields).forEach((key) => {
        this[key] = additionalFields[key]
      })
    }
  }
}

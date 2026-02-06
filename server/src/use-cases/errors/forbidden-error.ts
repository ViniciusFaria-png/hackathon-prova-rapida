export class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message || "You don't have permission to perform this action");
  }
}

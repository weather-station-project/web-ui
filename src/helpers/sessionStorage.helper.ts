export function isValuePresentInSessionStorage(key: string): boolean {
  return getValueFromSessionStorageByKey(key) !== ''
}

export function getValueFromSessionStorageByKey(key: string): string {
  return sessionStorage && sessionStorage.getItem(key) ? (sessionStorage.getItem(key)?.trim() as string) : ''
}

/*private getValueAsNumber(key: string): number {
      return Number(this.getValue(key))
  }

  private getValueAsBoolean(key: string): boolean {
      return this.getValue(key).toLowerCase() === 'true'
  }*/

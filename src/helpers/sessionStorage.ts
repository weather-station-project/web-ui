export function isValuePresentInSessionStorage(key: string): boolean {
  return getValueFromSessionStorageByKey(key) !== ''
}

export function getValueFromSessionStorageByKey(key: string): string {
  return sessionStorage && sessionStorage.getItem(key) ? (sessionStorage.getItem(key)?.trim() as string) : ''
}

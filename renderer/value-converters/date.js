
export class dateValueConverter {
  toView(value, format = 'MMM, ddd DD, YYYY') {
    return dayjs(value || new Date()).format(format);
  }
}
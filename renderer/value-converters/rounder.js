export class rounderValueConverter {
  toView(value) {
    return +(Math.round(value + "e+2") + "e-2")
  }
}
export const copyTextToClipboard = (text: string) => {
  const textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  if (window.navigator.platform === "iPhone") {
    textField.setSelectionRange(0, 99999);
  } else {
    textField.select();
  }
  document.execCommand("copy");
  textField.remove();
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.substring(1);

export const numberWithCommas = (x: string) =>  {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

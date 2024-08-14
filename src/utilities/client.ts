
export const calculateEntropy = (string?: string) => string ? Math.round(string.length * Math.log([
    { re: /[a-z]/, length: 26 }, 
    { re: /[A-Z]/, length: 26 }, 
    { re: /[0-9]/, length: 10 }, 
    { re: /[^a-zA-Z0-9]/, length: 33 },
].reduce((length, charset) => length + (charset.re.test(string) ? charset.length : 0), 0)) / Math.LN2): 0;
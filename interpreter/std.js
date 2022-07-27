module.exports = {
    fevers: [
        "len a = a \\> 0 $ + 1",
        "if true b c = b",
        "if false b c = c",
        "idx a i = a \\> 0 if eq i # @ $",
        "hd a = if > len a 0 idx a 0 false",
        "last a = idx a ((len a) - 1)",
        "set a i v = a -> if eq # i v @",
        "rev a = a -> idx a ((len a) - (#+1))",
        "fib 0 = 0",
        "fib 1 = 1",
        "fib n = (fib (n-1)) + (fib (n-2))",
        "square n = n * n",
        "pow a 0 = 1",
        "pow a b = a * pow a b - 1",
        "powi a b = arr b a \\> 1 ($ * @)",
    ]
}
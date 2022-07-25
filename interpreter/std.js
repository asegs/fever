module.exports = {
    fevers: [
        "len a = a \\> 0 $ + 1",
        "if true b c = b",
        "if false b c = c",
        "idx a i = a \\> 0 if eq i # @ $",
        "set a i v = a -> if eq # i v @"
    ]
}
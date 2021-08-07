
function InitTests()
{
    const { IsTestnet } = Util();

    interface Addresses
    {
        segwitAddress: string;
        bech32Address: string;
        legacyAddress: string;
    }

    interface TestAddressAndPrivateKey
    {
        privateKey: string;
        addresses: Addresses;
    }

    interface Bip38Test
    {
        encryptedPrivateKey: string;
        encryptedPrivateKeyFromPrivateKey: string;
        decryptedPrivateKey: string;
        password: string;
        addresses: Addresses;
    }

    interface Bip39Test
    {
        seed: string;
        password: string;
        rootKey: string;
    }

    interface Bip32Test
    {
        rootKey: string;
        path: string;
        extendedPubkey: string;
        extendedPrivateKey: string;
    }

    async function RunAllTests(onProgress: (current: number, total: number) => void): Promise<string[]>
    {
        if (IsTestnet())
        {
            alert("No tests are implemented for testnet!");
            return [];
        }

        const totalNumTests = 42;
        let numCompletedTests = 0;

        function UpdateProgress()
        {
            onProgress(numCompletedTests++, totalNumTests);
        }

        const failedTestMessages: string[] = [];

        function AssertEqual(actual: any, expected: any, errorMessage: string)
        {
            if (actual !== expected)
            {
                failedTestMessages.push(`Assertion failed: ${errorMessage}\nExpected: ${expected}\nActual: ${actual}`);
            }
        }

        function Assert(actual: boolean, errorMessage: string)
        {
            AssertEqual(actual, true, errorMessage);
        }

        async function TestAddressesAndPrivateKeys()
        {
            const testAddresses: TestAddressAndPrivateKey[] = [];

            testAddresses.push({
                privateKey: "T7ABWNaH1ehSzP5mgRAYESaBGJo3JcVYrSmtNodvusy2fF7qzbgQ",
                addresses: {
                    segwitAddress: "NLm748AUHXEiE7JMU6RTKLUpTzxwDGWkUe",
                    bech32Address: "ltfn1qsp26s98j795wputv2fctyd4k48gflmw3ru0393",
                    legacyAddress: "CUATg7pQBwYrwLv7zZb4Bg3aCKDep3cX3z"
                }
            });
            testAddresses.push({
                privateKey: "T49uGvN6vcH5jjd89QNG84vKUCfuq8Xr66BEfECexH1wphZvVoaJ",
                addresses: {
                    segwitAddress: "Ng3zBd9jhGC1T8EjoeBDNTy8ca3xUkuzPG",
                    bech32Address: "ltfn1q5kge3zam5yj9e2eyrcfyhrxmp55ffvr03pfc2m",
                    legacyAddress: "CXZLUsZRfeV1QGfMgyGHrBLHARiF352pPx"
                }
            });
            testAddresses.push({
                privateKey: "T8cAxR15ec4sJGEhnokT42pAtoABEXsFnJCaydcAGkiEeNeC6pUj",
                addresses: {
                    segwitAddress: "Nc35nPusn5Nx7WUJQrq5fx4eGx8FgvbXEj",
                    bech32Address: "ltfn1qz6y9jvnsh8dyl2g7hu8cvsns9jshcvek0va3kl",
                    legacyAddress: "CJX2mv6X5wKvYV6YngKjbnfnsWHU4oRR8A"
                }
            });

            await Promise.all(testAddresses.map(testCase => (async () =>
            {
                try
                {
                    const privateKeyResult = await WorkerInterface.GetPrivateKeyDetails(testCase.privateKey);
                    if (privateKeyResult.type !== "ok")
                    {
                        Assert(false, `Address generation error for private key: ${testCase.privateKey}`);
                        return;
                    }

                    const { segwitAddress, bech32Address, legacyAddress } = privateKeyResult;

                    AssertEqual(segwitAddress, testCase.addresses.segwitAddress, "Segwit address does not match");
                    AssertEqual(bech32Address, testCase.addresses.bech32Address, "Bech32 address does not match");
                    AssertEqual(legacyAddress, testCase.addresses.legacyAddress, "Legacy address does not match");
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        async function TestBip38()
        {
            const testCases: Bip38Test[] = [];

            testCases.push({
                password: "a",
                encryptedPrivateKey: "6PnSbEKP5szzNUSfLzpKzctGqAo713KqLsM4dacwmGL2wxamrXSvVjUTqz",
                encryptedPrivateKeyFromPrivateKey: "6PYQWc9jZXobFtFnTU6iwq2zjta6KkhMnLGMSMZ7inkiqtWM8rhKCPFwzb",
                decryptedPrivateKey: "TAC5ygmw95Sa878drXbBHD3To3dbHSmdpM5FSwYcEsCwrXiRnmRq",
                addresses: {
                    segwitAddress: "NiiahAzhW8VfSwYtpJF1CBsvgpkbYz54Ef",
                    bech32Address: "ltfn1q4c3wgh45g5tgv8d3450nu0sdy0vnygyzque47m",
                    legacyAddress: "CYLdwmDxGBHfaEFVNNbg77aC9gSDbU6NqN"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnQLa8UmAB9FDwQi6Z9XF9Th6JMueRMQV8rTc4EF5sKmvEHTv7DJFzrib",
                encryptedPrivateKeyFromPrivateKey: "6PYNFwxqE384gSJow7Ak4qpcd8wDZpHdVdF8HtjCsaDGCARw58tbih3dWy",
                decryptedPrivateKey: "T8Tqb2hhjjKfkCTTHMuMj2PJrgT3QNrpQVkGwpuxFPBGLNFGoM3d",
                addresses: {
                    segwitAddress: "NciwCm2vRem8dLedt3xPndjrkUw8YuKeD4",
                    bech32Address: "ltfn1qqmwf3ve2v68tmpk73xkw5sz779ndg5ee9g0twk",
                    legacyAddress: "CH6AtWDu78N9kE5nJ9UppMv2KGqs4vjeAi"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnS5M1Z1Afke3Ejox6CDPMSNyT5dkvd5eZhXmVPhAEy2ZKzG3NQxqB3WR",
                encryptedPrivateKeyFromPrivateKey: "6PYPziquUwGtswbdwY49Jm1ih5QGjuXTAAnua1iRhWD9cn2MRwqbW9Vnhe",
                decryptedPrivateKey: "T6LEC4EWZcMHddoFqpNxXqsW948KaFRv7Foibc2kvKMMF2vrk9rp",
                addresses: {
                    segwitAddress: "NLUhV1UAcNdDjUdk67Ru2XbNdvt99LuXZ3",
                    bech32Address: "ltfn1qgqhq9wxm08qg9em2p7d9egcvdj6nr88fx7sxrc",
                    legacyAddress: "CNKEwCAMGgHFXTUtihtqBojTFGNM5TJJoM"
                }
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                async function TestDecrypt(privateKey: string, password: string)
                {
                    try
                    {
                        const decrypted = await WorkerInterface.BIP38DecryptPrivateKey(privateKey, password);
                        if (decrypted.type === "err")
                        {
                            Assert(false, `Bip38 decrypt error for private key "${privateKey}" with password "${password}"`);
                        }
                        else
                        {
                            const decryptedPrivateKey = decrypted.result;
                            AssertEqual(decryptedPrivateKey, testCase.decryptedPrivateKey, "Decrypted private keys do not match");

                            const addressResult = await WorkerInterface.GetPrivateKeyDetails(decryptedPrivateKey);
                            if (addressResult.type !== "ok")
                            {
                                Assert(false, `Cannot get addresses from private key: ${decryptedPrivateKey}`);
                            }
                            else
                            {
                                AssertEqual(addressResult.segwitAddress, testCase.addresses.segwitAddress, "Decrypted segwit address does not match");
                                AssertEqual(addressResult.bech32Address, testCase.addresses.bech32Address, "Decrypted bech32 address does not match");
                                AssertEqual(addressResult.legacyAddress, testCase.addresses.legacyAddress, "Decrypted legacy address does not match");
                            }
                        }
                    }
                    catch (e)
                    {
                        Assert(false, "Unexpected error: " + e.message);
                    }
                }

                await TestDecrypt(testCase.encryptedPrivateKey, testCase.password);
                await TestDecrypt(testCase.encryptedPrivateKeyFromPrivateKey, testCase.password);

                async function TestEncrypt(privateKey: string, password: string)
                {
                    try
                    {
                        const encrypted = await WorkerInterface.BIP38EncryptPrivateKey(privateKey, password);
                        if (encrypted.type === "err")
                        {
                            Assert(false, `Cannot encrypt private key: ${privateKey} (using password: "${password}")`)
                        }
                        else
                        {
                            AssertEqual(encrypted.result, testCase.encryptedPrivateKeyFromPrivateKey, "Encrypted private key does not match");
                        }
                    }
                    catch (e)
                    {
                        Assert(false, "Unexpected error: " + e.message);
                    }
                }

                await TestEncrypt(testCase.decryptedPrivateKey, testCase.password);

                UpdateProgress();
            })()));
        }

        async function TestBip39()
        {
            const testCases: Bip39Test[] = [];
            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "",
                rootKey: "xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "a",
                rootKey: "xprv9s21ZrQH143K2TDcPeVnyE7Txn71rTGhYsXrdQBVMqYjubbSV4pCGMQXzim3ayzK46pURGRCG5r6KbkDN9NLQUTCDwZk9WU3tkSRZj6k6Gm"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2Y2XSuzBQaznCBg9AaRH2S25oKUAjmQEsEccMs8Ze85oGXge9xadr9vJv3r8CCtjgTGWFSjm6cHHAfGYJriZt43JgKVxDe1"
            });

            testCases.push({
                seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K3GPCDEC6aPqoyLsG2u3k1Lm98EuPJX6F92WXrU4BPKdjkabyje5myuDWhyzUxa8ibSzUSJAb3ULLYLLdwMrxLH48dQunkpr"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "",
                rootKey: "xprv9s21ZrQH143K3vkVeVcLG5PeVoexN6hpu9r4mS2j3uVeZo7vBrRNGHENDZXwYBgbQ5eMvHCX9YRL8V7aykC7a4UNkvJCuBacLRHwsdMGhNF"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "a",
                rootKey: "xprv9s21ZrQH143K3Fh1GnR64eBTs2WRhNz7Fc7NSXheWAnurFqLLjNRD7FNJXbdWm7Ky3B3hS3Lob6vSJd1PY6eZ7XUmTR6PCfCGzyt4Z4FRaM"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "Test Password 1234",
                rootKey: "xprv9s21ZrQH143K2MRhDJs9Qk6iSxHhezBbDGE1GFQqWy5zyw9P32GbXeM387p61HcQKdN93eL2W5Z3vF9ty9Gmr3ZtedcFLsDMZ3fkMcKBK2s"
            });

            testCases.push({
                seed: "void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold",
                password: "😂👌🔥💯💯💯🅱",
                rootKey: "xprv9s21ZrQH143K26EJnA1yj46hTFK85x2X2JeghGeichfdSdLAoQfgA5fQHvSo556Qjme7mXN3AbvDPhioe9C5GhmFAzQWdaSvnvkyuHy5mQa"
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                try
                {
                    if (!(<any>String.prototype).normalize)
                    {
                        // string normalize not available, skip this test
                        return;
                    }

                    const seedResult = await WorkerInterface.GetBIP32RootKeyFromSeed(testCase.seed, testCase.password);
                    if (seedResult.type === "err")
                    {
                        Assert(false, `Cannot get root key from seed: "${testCase.seed}" (using password: "${testCase.password}")`);
                    }
                    else
                    {
                        AssertEqual(seedResult.result, testCase.rootKey, "Root key derived from mnemonic seed does not match");
                    }
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        async function TestBip32()
        {
            const testCases: Bip32Test[] = [];
            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8",
                extendedPrivateKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'",
                extendedPubkey: "xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw",
                extendedPrivateKey: "xprv9uHRZZhk6KAJC1avXpDAp4MDc3sQKNxDiPvvkX8Br5ngLNv1TxvUxt4cV1rGL5hj6KCesnDYUhd7oWgT11eZG7XnxHrnYeSvkzY7d2bhkJ7"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1",
                extendedPubkey: "xpub6ASuArnXKPbfEwhqN6e3mwBcDTgzisQN1wXN9BJcM47sSikHjJf3UFHKkNAWbWMiGj7Wf5uMash7SyYq527Hqck2AxYysAA7xmALppuCkwQ",
                extendedPrivateKey: "xprv9wTYmMFdV23N2TdNG573QoEsfRrWKQgWeibmLntzniatZvR9BmLnvSxqu53Kw1UmYPxLgboyZQaXwTCg8MSY3H2EU4pWcQDnRnrVA1xe8fs"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'",
                extendedPubkey: "xpub6D4BDPcP2GT577Vvch3R8wDkScZWzQzMMUm3PWbmWvVJrZwQY4VUNgqFJPMM3No2dFDFGTsxxpG5uJh7n7epu4trkrX7x7DogT5Uv6fcLW5",
                extendedPrivateKey: "xprv9z4pot5VBttmtdRTWfWQmoH1taj2axGVzFqSb8C9xaxKymcFzXBDptWmT7FwuEzG3ryjH4ktypQSAewRiNMjANTtpgP4mLTj34bhnZX7UiM"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2",
                extendedPubkey: "xpub6FHa3pjLCk84BayeJxFW2SP4XRrFd1JYnxeLeU8EqN3vDfZmbqBqaGJAyiLjTAwm6ZLRQUMv1ZACTj37sR62cfN7fe5JnJ7dh8zL4fiyLHV",
                extendedPrivateKey: "xprvA2JDeKCSNNZky6uBCviVfJSKyQ1mDYahRjijr5idH2WwLsEd4Hsb2Tyh8RfQMuPh7f7RtyzTtdrbdqqsunu5Mm3wDvUAKRHSC34sJ7in334"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi",
                path: "m/0'/1/2'/2/1000000000",
                extendedPubkey: "xpub6H1LXWLaKsWFhvm6RVpEL9P4KfRZSW7abD2ttkWP3SSQvnyA8FSVqNTEcYFgJS2UaFcxupHiYkro49S8yGasTvXEYBVPamhGW6cFJodrTHy",
                extendedPrivateKey: "xprvA41z7zogVVwxVSgdKUHDy1SKmdb533PjDz7J6N6mV6uS3ze1ai8FHa8kmHScGpWmj4WggLyQjgPie1rFSruoUihUZREPSL39UNdE3BBDu76"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcEZVB4dScxMAdx6d4nFc9nvyvH3v4gJL378CSRZiYmhRoP7mBy6gSPSCYk6SzXPTf3ND1cZAceL7SfJ1Z3GC8vBgp2epUt13",
                extendedPrivateKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6",
                path: "m/0'",
                extendedPubkey: "xpub68NZiKmJWnxxS6aaHmn81bvJeTESw724CRDs6HbuccFQN9Ku14VQrADWgqbhhTHBaohPX4CjNLf9fq9MYo6oDaPPLPxSb7gwQN3ih19Zm4Y",
                extendedPrivateKey: "xprv9uPDJpEQgRQfDcW7BkF7eTya6RPxXeJCqCJGHuCJ4GiRVLzkTXBAJMu2qaMWPrS7AANYqdq6vcBcBUdJCVVFceUvJFjaPdGZ2y9WACViL4L"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m",
                extendedPubkey: "xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB",
                extendedPrivateKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0",
                extendedPubkey: "xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH",
                extendedPrivateKey: "xprv9vHkqa6EV4sPZHYqZznhT2NPtPCjKuDKGY38FBWLvgaDx45zo9WQRUT3dKYnjwih2yJD9mkrocEZXo1ex8G81dwSM1fwqWpWkeS3v86pgKt"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'",
                extendedPubkey: "xpub6ASAVgeehLbnwdqV6UKMHVzgqAG8Gr6riv3Fxxpj8ksbH9ebxaEyBLZ85ySDhKiLDBrQSARLq1uNRts8RuJiHjaDMBU4Zn9h8LZNnBC5y4a",
                extendedPrivateKey: "xprv9wSp6B7kry3Vj9m1zSnLvN3xH8RdsPP1Mh7fAaR7aRLcQMKTR2vidYEeEg2mUCTAwCd6vnxVrcjfy2kRgVsFawNzmjuHc2YmYRmagcEPdU9"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1",
                extendedPubkey: "xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon",
                extendedPrivateKey: "xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'",
                extendedPubkey: "xpub6ERApfZwUNrhLCkDtcHTcxd75RbzS1ed54G1LkBUHQVHQKqhMkhgbmJbZRkrgZw4koxb5JaHWkY4ALHY2grBGRjaDMzQLcgJvLJuZZvRcEL",
                extendedPrivateKey: "xprvA1RpRA33e1JQ7ifknakTFpgNXPmW2YvmhqLQYMmrj4xJXXWYpDPS3xz7iAxn8L39njGVyuoseXzU6rcxFLJ8HFsTjSyQbLYnMpCqE2VbFWc"
            });

            testCases.push({
                rootKey: "xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U",
                path: "m/0/2147483647'/1/2147483646'/2",
                extendedPubkey: "xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt",
                extendedPrivateKey: "xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j"
            });

            await Promise.all(testCases.map(testCase => (async () =>
            {
                try
                {
                    const deriveResult = await WorkerInterface.DeriveBIP32ExtendedKey(testCase.rootKey, testCase.path, "32", false, false);
                    if (deriveResult.type === "err")
                    {
                        Assert(false, `Cannot derive extended key from root key: "${testCase.rootKey}", path: ${testCase.path}`);
                    }
                    else
                    {
                        Assert(deriveResult.result.privateKey !== null, "Could not derive private key");
                        AssertEqual(deriveResult.result.privateKey, testCase.extendedPrivateKey, "Extended private keys don't match");
                        AssertEqual(deriveResult.result.publicKey, testCase.extendedPubkey, "Extended public keys don't match");
                    }
                }
                catch (e)
                {
                    Assert(false, "Unexpected error: " + e.message);
                }

                UpdateProgress();
            })()));
        }

        UpdateProgress();

        await Promise.all([
            TestAddressesAndPrivateKeys(),
            TestBip38(),
            TestBip39(),
            TestBip32()
        ]);

        return failedTestMessages;
    }

    return RunAllTests;
}

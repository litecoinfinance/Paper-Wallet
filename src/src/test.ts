
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
                privateKey: "L3BqTud9apaZXAWU9u2zKUQwaSwRnx2MT3McTqKLGwQrd6NWxA7x",
                addresses: {
                    segwitAddress: "DAdTvd47zKjHGwKUDHBvcryDrjtMjeGMKg",
                    bech32Address: "web1q454nqlp9aln53kt9h0asz6l2cg0vcpe93hu6jk",
                    legacyAddress: "EYwY8d4etjVisQkfCVc4ayh82Fz3Bcnf1p"
                }
            });
            testAddresses.push({
                privateKey: "KwQDBB8owQe3K22YHT3V2QETKEiAX6KJMo7dn6WXvderUNymL6zg",
                addresses: {
                    segwitAddress: "DQUAiXjCHq2KMyGZM4eE4JvbTLfLPNw8Gi",
                    bech32Address: "web1qcz6a76d35ttcfdyydd0dpk7p27v5p99f3dh2jh",
                    legacyAddress: "Eais79pN9pKAXLBzeewsq9GYtaDXSgWdTe"
                }
            });
            testAddresses.push({
                privateKey: "L5k9t65Hgsz3UMFPbLAgDUL9NhpzFd5SSwcHtQSBZgLe8vnLqW2E",
                addresses: {
                    segwitAddress: "DSQQkgD1pj6XdsUA32c65HSU5R4kU3wzQh",
                    bech32Address: "web1qmu39dx98nmvjj259cl9z0zg5z3d0sdvrxre9md",
                    legacyAddress: "EdVjKE7rRLaHkUUVPiNFGW2E1xu4J2uwXx"
                }
            });
            testAddresses.push({
                privateKey: "L5hRL78FhX26VWKFKW1Pt4q68FBmm2CyN8dfBvp1ZXa9fq6GCoBi",
                addresses: {
                    segwitAddress: "DMQDFdBAxLxsntqMQW6ohN9Zm7PMMMWZS7",
                    bech32Address: "web1q55vysm2casd7kgxavw25kxc30fa23pqve5hqxf",
                    legacyAddress: "EYCr5SeRv7D6qu7xozqZ85sJRLY94W2pAi"
                }
            });
            testAddresses.push({
                privateKey: "KxHYFQGNs7vjTJZATBEyU9WTip9nTs7K1RxAdrgxqySUuwAiHp55",
                addresses: {
                    segwitAddress: "DERwNnfbEGYpXqJvpEwTHYS2mRVZE1WV7x",
                    bech32Address: "web1q8d34u6gfnpecxjfkvrktcg2c04vu5gw5xjqt7g",
                    legacyAddress: "ENZvQAdJwsbemJ6n2HiCEpGqjq3Y1KhhDj"
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
                encryptedPrivateKey: "6PnYMPyrRwX63YtaE4deQYcV3Z3tg4TW7zeNGLDWTB5VHVXZdpDWRkQ6A6",
                encryptedPrivateKeyFromPrivateKey: "6PYWGmpCtGHbyQ2ZR7K4ECKYGCsE8v9giN3axnBQzN2kXmQmBp3P8PSeM5",
                decryptedPrivateKey: "L1iy6dbbAS8eaB2wucjVuguexnifnEpoNypXsQxHEiUZnmfkQKHG",
                addresses: {
                    segwitAddress: "DNT7cRQMWYr5eNHamaLmCdp2JDghSUPBzV",
                    bech32Address: "web1q2hsm3ggsluvlrgqg5wdug0t9hx65pl028syqwv",
                    legacyAddress: "EQz1LGrpAgd2YmsscP78etaNzYf3VQcwtD"
                }
            });
            testCases.push({
                password: "a",
                encryptedPrivateKey: "6PnVRY6RLHoMmCvkKuyKrocTutBaonRp5yQVGwnLcnrreK3xAzGyCttQ15",
                encryptedPrivateKeyFromPrivateKey: "6PYTLuvmnpCS7N3zvMfGEqrtvst8oip4nc7vBFoMu3YhW8LrGPKaM6nNrj",
                decryptedPrivateKey: "L49RPSvbDsY8Xk5oBi2Xnrx8J7Y4i38AxLEiDAsAQndNgEzaG44T",
                addresses: {
                    segwitAddress: "DJtAV13dTS67ruAo5J1Zb3EGm2H7yCXVqt",
                    bech32Address: "web1qt3zg0nvaqm4d3q2ye0lewnmsmqyh8eqnvchgy0",
                    legacyAddress: "ERZmkpAEnxfhoqG52XARmJRFwcrYpw5YX2"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnVGb4eGJi2SoiXA8xJNhkWm3HcVKtRqPo7n2rWEX4QyRmSbrrZnKD3me",
                encryptedPrivateKeyFromPrivateKey: "6PYTBxtzid2TotMFVQJcjtJ7U3wVVkL3yZWEm1zo37bbY31vaizYWf253o",
                decryptedPrivateKey: "KzLEXSxbPbmpqUMUeEWdx5xgVbwDdBpSHRZzo4DScyJLqwrvZiZo",
                addresses: {
                    segwitAddress: "DE2GdQ94GSX6bXZEUgpPrpi7JhB8K4229B",
                    bech32Address: "web1q58uxe6yh2fqclu2zmvg8eavjsqnnc7dyudnm6s",
                    legacyAddress: "EXvKtNQpdDurYbrh5JHNfNGMyzbi7RzdLy"
                }
            });
            testCases.push({
                password: "Test Password 1234",
                encryptedPrivateKey: "6PnWy4Wxu13vHD2mi1kAda7DuD58CLLMSL75keE4SANfSXFCzPnLXD4UPg",
                encryptedPrivateKeyFromPrivateKey: "6PYUtSMKLHijKpqFyvXarqMAx84UR476iHfkLWGxh3LgeuX6Nghhijuzcm",
                decryptedPrivateKey: "KzkL7LDyjFErKQmxD96Uw6Q6yL9EgDT7YmaBf8PY3vZss9c6xW3r",
                addresses: {
                    segwitAddress: "DG7Ch2FgMcK5pm6Udyc9xNRdw9KRweoh47",
                    bech32Address: "web1qz62dhzuftu29qztufmprtcxs7wk4m8d3l2uanp",
                    legacyAddress: "EKDJgcRzm1A3pHiSf1iEVbRf9cSLXNrMht"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnMqQQdg4smPy3VTp1fGSjFTywyaxmR95MKoV7FJZ8V6bnuCBNmgHsH7B",
                encryptedPrivateKeyFromPrivateKey: "6PYKknEz8gZLf63HuiHUExku1WH1jt33ehFKj6viqwmVxWFAanMAxNqpun",
                decryptedPrivateKey: "L1pwbhHmpCP2HBpg4iXciB24cqTdDAathEuWEKwDZi8kxftmb1r9",
                addresses: {
                    segwitAddress: "DLGK5cVs39DirzLvxCTkxawhNXh2sB11P5",
                    bech32Address: "web1qatdw8u69493fj0ps98aaejzgtuvuryqpqnfymj",
                    legacyAddress: "EeZhqFEjcGe67o1NtDfR9s91FJQDquBcTY"
                }
            });
            testCases.push({
                password: "😂👌🔥💯💯💯🅱",
                encryptedPrivateKey: "6PnMurgcH6CqhnGSeB6tAons51gniWVQToXgf65T3zSPeQK8UGojRAhmxy",
                encryptedPrivateKeyFromPrivateKey: "6PYKqEWxjimL8o7cQghwBwF13wNW7SWr4PNqi8eDHNM55G7RiRQvRLcwAH",
                decryptedPrivateKey: "Kz6LXhZeMdCLYpX5CzjhVY3DRBMTuW1qwNW5AAiihZaQbSUkHyy6",
                addresses: {
                    segwitAddress: "DEhWg8W9k9TSKwfLk7WZsgPiwGsz9LKEs1",
                    bech32Address: "web1q29w6y7p8exx4sa7m5avqltc2vnaajpycd422v6",
                    legacyAddress: "EQa8PyK7sTDxUpuVSabvvpbnqhRXjNGNDW"
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

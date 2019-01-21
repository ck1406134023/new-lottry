import store from "../store";
import Eos from "eosjs";

export const network = {
    blockchain: "eos",
    host: "geo.eosasia.one",
    port: 443,
    protocol: "https",
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
}
export const restApi = Eos({
    httpEndpoint: `${network.protocol}://proxy.eosnode.tools:${network.port}`,
    chainId: network.chainId
})

// export const network = {
//     blockchain: "eos",
//     host: "api.jungle.alohaeos.com",
//     port: 443,
//     protocol: "https",
//     chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"
// }


// export const restApi = Eos({
//     httpEndpoint: `${network.protocol}://api.jungle.alohaeos.com:${network.port}`,
//     chainId: network.chainId
// })

function handleError(errmsg, context) {
    let e = JSON.stringify(errmsg);
    if ("string" === typeof e) {
        if (e.includes("unsatisfied_authorization"))
            return context.$t("apiErrors.unsatisfiedAuthorization", {
                accountName: context.$store.state.account.name,
                permission: context.$store.state.account.authority
            });
        if (e.includes("overdrawn balance"))
            return context.$t("apiErrors.overdrawnBalance");
        if (e.includes("ram_usage_exceeded"))
            return context.$t("apiErrors.ramUsageExceeded");
        if (e.includes("signature_rejected"))
            return context.$t("apiErrors.signature_rejected");
        if (e.includes("leeway_deadline_exception"))
            return context.$t("apiErrors.cpuUsageExceeded");
        if (e.includes("tx_net_usage_exceeded"))
            return context.$t("apiErrors.netUsageExceeded");
        if (
            e.includes("deadline_exception") ||
            e.includes("tx_cpu_usage_exceeded")
        )
            return context.$t("apiErrors.deadlineExceeded");
        try {
            e = JSON.parse(e);
        } catch (e) {}
    }
    return context.$t("apiErrors.unexpectedError") + "\n" + JSON.stringify(e, null);
}

// 添加币种图片，src为base64
export const supportCoin = {
    eos: {
        contract: "eosio.token",
        symbol: "EOS",
        fixed: 4,
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAVCAYAAAB2Wd+JAAABYUlEQVQ4jX3UP2sVQRSG8d9dCGpKGwOCCBkQFBWMCfcT2KWwiJaCYKVfwDK1jWipWIrc2BiwUhs/gCCmm9MGxUbs7MYic2VcZu+Bhd2Z8+z77J8ZpRS9I+e8MTVXSjHoVESs41NE3O/Now/iKS7jWURc6jXMSinjtD0smqGvmKeU/kwmRsRFvBjd/DqeTCZGxBo+Y94xK7idUnrXS3w0AcEMryLidA/ME9CyjtvnHKrmOXzA7xXgIiI2xom7uILDFeAB9sfgTYw/Q1vf8AP3IuJ8C25XcEp3Ua1O1V5DRJzBVWyu0D3AncbOgGtYq4M93aXmrXq9swS3m6aebqsJWxExG4Ob1aDVbTXhLNKwjG7qbqM71lzW1oA3aP/8PXysumNN+IKjIaW07+Rtvq8TF5ysiMOR5i88xE5K6ei/9RgRu3iOt3iJ71X1NR6nlH7+a+7sNes55wf1/EbOed7bc/4CUTq6he/WHK4AAAAASUVORK5CYII=",
        minAmount: 0.25
    }
}

export function eosTransaction(account, name, data) {
    if (scatter) {
        return new Promise((resolve, reject) => {
            const eos = scatter.eos(network, Eos, {});
            eos.transaction({
                actions: [{
                    // 合约账户
                    account: account,
                    // 交易类型
                    name: name,
                    authorization: [{
                        actor: store.state.account.name,
                        permission: store.state.account.authority
                    }],
                    data: data
                }]
            }).then(() => {
                resolve("success");
            }).catch(() => {
                reject("error");
            });
        });
    }
}

export function api(coinType, action, data, vm, successBack, errorCallback) {
    // coinType 表示 押注使用的代币
    vm.$message.info(vm.$t("apiErrors.waitFor"));
    if (data.quantity) {
        if (data.quantity < supportCoin[coinType].minAmount) {
            vm.$message(`${vm.$t("apiErrors.noLessThan")}${supportCoin[coinType].minAmount} EOS`)
            return;
        }
        data.quantity = Number(data.quantity).toFixed(supportCoin[coinType].fixed) + " " + "EOS";
    }
    if (scatter) {
        const eos = scatter.eos(network, Eos, {});
        eos.transaction({
            actions: [{
                // 合约账户
                account: "eosio.token",
                // 交易类型
                name: action,
                authorization: [{
                    actor: store.state.account.name,
                    permission: store.state.account.authority
                }],
                data: data
            }]
        }).then((res) => {
            successBack(res)
            vm.$message.success(vm.$t("apiErrors.success"));
        }).catch((err) => {
            errorCallback(err)
            vm.$message.error(handleError(err, vm));
        })
    }
}
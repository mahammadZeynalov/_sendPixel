// @ts-nocheck
import { useAccount, useEnsName, useEnsAvatar, useEnsAddress } from "wagmi";
import { formatAddress } from "ens-tools";
import { normalize } from "viem/ens";

export const NameLookup = () => {
  const name = normalize("mycompany.eth");
  const { data: avatar } = useEnsAvatar({ name });
  const { data: ethereum } = useEnsAddress({ name, coinType: 60 });

  return (
    <div>
      {ethereum && formatAddress(ethereum)}
      <br />
      {avatar && <img src={avatar} />}
    </div>
  );
};

export const YourApp = () => {
  //   const { address } = useAccount();
  const address = "0xdb61e9f123606359d2be7c310631efd7e9afee3f";
  const { data: name } = useEnsName({ address });
  const { data: avatar } = useEnsAvatar({ name });

  return (
    <div className="flex items-center gap-2">
      <img
        src={avatar || "https://docs.ens.domains/fallback.svg"}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col gap-0 leading-3 pr-10">
        {name && <span className="font-bold">{name}</span>}
        <span>{formatAddress(address)}</span>
      </div>
    </div>
  );
};

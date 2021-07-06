import React, { useState } from 'react';
import { ASSET_TYPE, ASSET_NAME, ASSETS } from 'consts/assets';
import { filter, map } from 'lodash';

import { SectionTitle } from '../Blocks';

const AssetList = ({ handleChange, defaultAsset, mode = ASSET_TYPE.BORROW }) => {
  const [selectedAsset, setSelectedAsset] = useState(ASSET_NAME[defaultAsset]);
  const assets = filter(ASSETS, asset => asset.type === mode);
  return (
    <div className="borrow-options">
      <SectionTitle fontSize={3}>
        {mode === ASSET_TYPE.BORROW ? 'Borrow' : 'Collateral'}
      </SectionTitle>
      <div className="select-options">
        <div className="options-list">
          {map(assets, asset => (
            <label key={asset.id}>
              <input
                type="radio"
                name={`${mode}-borrow`}
                value={asset.name}
                onChange={() => {
                  setSelectedAsset(asset.name);
                  handleChange(asset.name);
                }}
                checked={selectedAsset === asset.name}
              />
              <div className="fake-radio">
                <img alt={asset.id} src={asset.icon} style={{ width: '26px', height: '26px' }} />
                <span className="select-option-name">{asset.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetList;

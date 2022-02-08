import React from 'react';

function Store() {
  return (
    <>
      <p>
        <strong>23,459</strong> energy points <strong>(?)</strong>
      </p>
      <p>
        Burn energy points and buy a crate.
        <br />
        When you open a crate you can get nothing, free points or booster cards
      </p>
      {/* Note: should we use a loop to display crates ? Careful the last one is displayed differently */}
      <div>
        <h3>Common</h3>
        <p>1,000</p>
        <p>Energy points</p>
        <div>
          <button type="button">+</button> 0 <button type="button">-</button>
        </div>
        <button type="submit">Buy</button>
      </div>

      <div>
        <h3>Epic</h3>
        <p>2,500</p>
        <p>Energy points</p>
        <div>
          <button type="button">+</button> 0 <button type="button">-</button>
        </div>
        <button type="submit">Buy</button>
      </div>

      <div>
        <h3>Legendary</h3>
        <p>5,000</p>
        <p>Energy points</p>
        <div>
          <button type="button">+</button> 0 <button type="button">-</button>
        </div>
        <button type="submit">Buy</button>
      </div>
    </>
  );
}

export default Store;

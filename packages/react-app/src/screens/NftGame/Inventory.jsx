import React from 'react';

function Inventory() {
  return (
    <>
      <p>
        You have <strong>3 crates</strong> to open
      </p>
      {/* <img /> */}
      <div>
        <h3>Climbing gear set</h3>
        {/* Note: where to fetch items ? Should we fetch them from contract or hardcode it ? */}
        <p>
          Heat capsule <strong>+5%</strong>
        </p>
        <p>
          Heat capsule <strong>+5%</strong>
        </p>
        {/* .. */}
      </div>
      {/* Notes: we shall use a modal to open crates and display item overview. Maybe it's already implemented */}
    </>
  );
}

export default Inventory;

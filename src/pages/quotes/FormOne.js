import React, { useState, useEffect } from "react";
import CustomSelect from "../../component/quotes/CustomSelect.js";
import qData from "./quoteData.js";

const data = qData.quote_data;

function FormOne(props) {
  const [quoteDataId, setQuoteDataId] = useState(props.quoteDataId);
 
  function onSelectChange(e) {
    if (!(e === null || e === "" || e === undefined)) {
      props.onSetQuoteDataChange(data.find((d) => d.id == e));
    } else {
      props.onSetQuoteDataChange({});
    }
  }

  return (
    <div className="Form">
      <h2>Quote Selection</h2>
      <form>
        <div>
          <label> Select Quote Type</label>
          <CustomSelect
            data={data}
            quoteDataId={quoteDataId}
            onSelectChange={onSelectChange}
          />
        </div>
      </form>
    </div>
  );
}

export default FormOne;

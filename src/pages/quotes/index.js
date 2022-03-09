
import React, { useState } from "react";
import { Route, Switch,  Link,  useRouteMatch, useHistory } from "react-router-dom";
import FormOne from "./FormOne";
import QuoteOne from "./QuoteOne";
import QuotePrint from "./QuotePrint";
import QuoteList from "./quoteList";
import QuoteEdit from './quoteEdit';
import {Space, Button} from "antd";
import QuoteChange from "./quoteChange";


export default function Quotes() {

  const [quoteDataId, setQuoteDataId] = useState('0');
  const [quoteData, setQuoteData] = useState({});
  const [quoteFormData, setQuoteFormData] = useState({});
  let { path, url } = useRouteMatch();
  let history = useHistory();
  function onSetQuoteDataChange(data) {
    if (!(data === null || data  === "" || data === undefined)) {
        setQuoteDataId(data.id);
        setQuoteData(data);
        history.push(`${url}/${data.id}/new/`)
    }else{
        setQuoteData({});
    }
  }
  function onSetQuoteFormDataChange(data) {
    if (!(data === null || data  === "" || data === undefined)) {
        setQuoteFormData(data);
        history.push(`${url}/${quoteDataId}/print/`)
    }else{
        setQuoteFormData({});
    }
  }


  return (
    <div style={{padding: "10px", margin: "10px"}}>
      <div>
        <h2> Quotes<Space style={{float:"right"}}><Link to="/quotes/quoteList" ><Button>View All Quotes</Button></Link>  <Link to="/quotes"><Button> New Quote  </Button></Link></Space></h2>
      </div> 
      <hr/>
      <Switch>
        <Route exact path={path} >
          <FormOne quoteDataId={quoteDataId} onSetQuoteDataChange={onSetQuoteDataChange} />
          </Route>
        <Route path="/quotes/:qid/new" >
          <QuoteOne key={quoteData} quoteData={quoteData} onSetQuoteFormDataChange={onSetQuoteFormDataChange} />
        </Route>
        <Route path="/quotes/:qid/edit" >
          <QuoteEdit quoteEditData = {quoteFormData} />
        </Route>
        <Route path="/quotes/:qid/print" >
          <QuotePrint key={quoteData} quoteFormData={quoteFormData}  quoteData={quoteData} />
        </Route>
        <Route path="/quotes/quoteList">
          <QuoteList/>
        </Route>
        <Route path="/quotes/change">
          <QuoteChange quoteFormData={quoteFormData} onSetQuoteFormDataChange={onSetQuoteFormDataChange} />
        </Route>
      </Switch>
      
    </div>
  )
}

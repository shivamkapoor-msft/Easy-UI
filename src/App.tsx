import React, { useState } from 'react';
import './App.css';
import { Configuration, OpenAIApi } from 'openai';
import { saveAs } from 'file-saver'

interface HistoryType {input: string, output: string}
const InputForm = (props: {}) => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] =useState<string>('');
    const [history, setHistory] =useState<HistoryType[]>([]);
    const [requestLoading, setRequestLoading] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);

    const handleInput = (e: any) => {
        setInput(e.target.value);
    }

    //function to handle form submission
    const handleSubmit = async (e: any, usePrevious: boolean) => {
    e.preventDefault();
    setRequestLoading(true);
    //make API call to OpenAI
      const configuration = new Configuration({
      organization: "org-spOT6QW3p2SX4AKbCRqy6VF4",
      apiKey: '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',
      });

      const openai = new OpenAIApi(configuration);
      //const {message} = req.body
      // console.log(`${message}`);
      const prompt = usePrevious ? "update " + input  + " in " + output : "Generate html css for " + input;
      const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          max_tokens: 2000,
          temperature: 0,
        });
        // console.log(response.data);
        if(response.data)
        {
          setRequestLoading(false);
          setIsStarted(true);
          if(response.data.choices[0].text)
          {
              const output = response.data.choices[0].text.toString();
              setOutput(output);
              history.push({input, output});
              setHistory(history);
              setInput("");
          } else {
              const output = "Failed to run. Either try with a different input or try again later";
              setOutput(output);
              history.push({input, output});
              setHistory(history);
          }
        }
    }

    const handleDownload = (response: string) => {
    // convert the variable content to blob
    if(response){
      const blob = new Blob([response], { type: 'text/html' })
      saveAs(blob, "template.html")
    }
  }

    const handleReload = (content: HistoryType) => {
    // convert the variable content to blob
    history.push(content);
    setHistory(history);
    setOutput(content.output);
  }

  return (
    <div>
      <header>
      <img src={require('./dalle logo.png')}/>
        <h1>Easy UI</h1>
      </header>
      <div className='container'>
        <div style={{"float":"left"}}>
          <div className= {isStarted ? 'historyContainer' : ''}>
            {
                history?.map(element => {
                return(
                <div className='history'>
                  {element.input}
                <div className='buttons'>
                  <button onClick={e => handleDownload(element.output)}>Download Code</button>
                  <button onClick={e => handleReload(element)}>Reload</button>
                </div>
                </div>) 
                })
            }
            </div>
            <form>
            What would you like to generate today?
              <input type="text" value={input} onChange={handleInput} placeholder='e.g. create twitter clone' />
              <div className='buttons'>
                {isStarted && !requestLoading && input ? <button onClick={e => handleSubmit(e, true)}>Update Previous</button> : <div/>}
                {requestLoading ? (<div style={{"display": "inline-block"}}>Loading...</div>) : <div/>}
                {!requestLoading && input ?(<button onClick={e => handleSubmit(e, false)}>Get New</button>) : <div/>}
              </div>
            </form>
        </div>
        <div style={{"float":"right"}}>
          <iframe title='Wireframe' srcDoc={output} height={400} width={900} />
        </div>
      </div>
    </div>
  );
};

export default InputForm;
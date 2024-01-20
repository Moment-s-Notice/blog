import { useState, useEffect } from 'react';

import Markdown from 'react-markdown'

function App() {
  const [state, setState] = useState({
    loaded: false,
    night: 0,
    posts: [],
    display: [],
  });

  useEffect(() => {
    setState({
      loaded: false,
      night: 0,
      posts: [],
      display: [],
    });

    let getPosts = async () => {
      let dat = await fetch(`https://raw.githubusercontent.com/Moment-s-Notice/posts/2023-01/tracker.txt`);
      dat = await dat.text();
      dat = dat.split('\n');

      dat.forEach(async (e) => {
        let res = await fetch(`https://raw.githubusercontent.com/Moment-s-Notice/posts/2023-01/${e}.md`);
        res = await res.text();
        res = res.split('\n^^^meta-data^^^\n');
        let meta = res[0].split('\n');

        setState(prevState => ({
          ...prevState,
          posts: [
            ...prevState.posts, 
            {
              title: meta[0].substring(7),
              author: meta[1].substring(8),
              date: meta[2].substring(6),
              content: res[1],
            },
          ],
        }));
      });
    }
    
    getPosts();
  }, []);

  useEffect(() => {


    if (state.posts.length) {
      setState(prevState => ({
        ...prevState,
        loaded: true
      }));
    }
  }, [state.posts]);

  return (
    <div className='background' style={{ filter: `invert(${state.night})` }}>
      <span className="material-symbols-outlined" onClick={() => { setState(prevState => ({ ...prevState, night: 1 - state.night })) }}>
        dark_mode
      </span>
      <div className='container'>
        <h1>Moment's Notice</h1>
        <hr />
        {
          state.loaded &&
          state.posts.map((e, i) => {
            return <div key={i}>
              <span className='metadata'>
                <h1 className='post-title'>{e.title}</h1>
                <div>
                  <div className='author-date'>{e.author}</div>
                  <div className='author-date'>{e.date}</div>
                </div>
              </span>
              <Markdown>{e.content }</Markdown>
            </div>
          })
        }
      </div>
    </div>
  );
}

export default App;

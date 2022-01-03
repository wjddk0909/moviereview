import { useState, useEffect } from 'react';
import './app.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactHtmlParser from 'html-react-parser';
import Axios from 'axios';

function App() {
  const [movieCont, setMovieCont] = useState({
    title: '',
    content: ''
  })

  const [viewCont, setViewCont] = useState([]);

  useEffect(()=>{
    Axios.get('http://localhost:8000/api/get').then((response)=>{
      setViewCont(response.data);
    })
  },[viewCont])

  const submitReview = ()=>{
    Axios.post('http://localhost:8000/api/insert', {
      title: movieCont.title,
      content: movieCont.content
    }).then(()=>{
      alert('등록 완료!');
    })
  };

  const getValue = e => {
    const { name, value } = e.target;
    setMovieCont({
      ...movieCont,
      [name]: value
    })
  };


  return (
    <div className="App">
      <h1>영화 리뷰</h1>
      <div className='form-wrap'>
        <input className="tit-input"
          type='text'
          placeholder='제목을 입력하세요'
          onChange={getValue}
          name='title'
        />
        <CKEditor
          editor={ClassicEditor}
          data=""
          onReady={editor => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setMovieCont({
              ...movieCont,
              content: data
            })
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      </div>
      <button
        className="submit-btn"
        onClick={submitReview}
        >저장</button>
      <div className='movie-cont'>
        {viewCont.map(element =>
          <div className='movie-box'>
            <h2>{element.title}</h2>
            <div>
              {ReactHtmlParser(element.content)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import './app.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactHtmlParser from 'html-react-parser';
import Axios from 'axios';

function App() {
  // 입력한 내용 state에 저장하는 변수 초기화
  const [movieCont, setMovieCont] = useState({
    title: '',
    content: ''
  })

  // 저장된 컨텐츠 담기
  const [viewCont, setViewCont] = useState([]);

  // 서버에 저장된 내용을 받아오기, 두번째 인자로 [viewCont]을 넣어주면 viewCont내용이 바뀔때 리렌더링 시킴
  useEffect(()=>{
    Axios.get('http://localhost:8000/api/get').then((response)=>{
      setViewCont(response.data);
    })
  },[viewCont])

  // 저장 버튼 눌렀을때 서버로 내용을 전송하는 함수, http://localhost:8000/api/insert로 내용을 post방식으로 전송
  const submitReview = ()=>{
    Axios.post('http://localhost:8000/api/insert', {
      title: movieCont.title,
      content: movieCont.content
    }).then(()=>{
      alert('등록 완료!');
    })
  };

  // input의 내용이 변할때 value값을 state에 업데이트
  const getValue = e => {
    const { name, value } = e.target;
    setMovieCont({
      ...movieCont, // 기존 리스트를 복사해서 가져오기
      [name]: value   // 입력한 값 넣어주기
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
              {/* ReactHtmlParser -> html태그 없이 보여주기위해 설치한 라이브러리*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
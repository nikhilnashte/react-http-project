import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [planetList, setPlanetList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const getMovies=useCallback(async()=>{
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://react-http-project-aedbc-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong !");
      }

      const data = await response.json();
      const loadMovies=[];
      for(const key in data){
             loadMovies.push({
              id:key,
              title:data[key].title,
              openingText:data[key].openingText,
              releasedate:data[key].releasedate,

             })
      }

      // console.log("🚀 ~ getMovies ~ data:", data);
      
      // eslint-disable-next-line no-unused-expressions
      // const selectedData = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     release_date: movieData.release_date,
      //     opening_crawl: movieData.opening_crawl,
      //   };
      // });
      setPlanetList(loadMovies);
    } catch(error) {
      setError(error.message);
    }
    setIsLoading(false);
  },[]);

  useEffect(()=>{
    getMovies();
 },[getMovies]);

 async function addMovieHandler(movie) {
  const response=await fetch("https://react-http-project-aedbc-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",{
    method:'POST',
    body:JSON.stringify(movie),
    headers:{
      'Content-Type':'application/json'
    }
  });

  const data= await response.json();
  console.log("🚀 ~ addMovieHandler ~ data:", data);
  
}

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={getMovies}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && planetList.length > 0 && (
          <MoviesList movies={planetList} />
        )}
        {!isLoading && planetList.length === 0 && "Movie Not Found"}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && "Loading ... "}
      </section>
    </React.Fragment>
  );
}

export default App;

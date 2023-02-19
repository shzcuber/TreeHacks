import React, { useEffect, useState } from 'react';
import Button from './Button';
import { getImagePaths } from '../util/getImagePaths';
import { downloadImagesAsZip } from '../util/downloadImagesAsZip';
import HomeButton from './HomeButton';
import './FilteredDownload.css'


function ImageCollectionWithSelect(props) {

    const handleClickImage = (path, e) => {
        e.preventDefault();
        const prevVal = document.getElementById(path).style.display;
        document.getElementById(path).style.display = prevVal=="block" ? "none" : "block";
    };

    return (<div id="image-collection-images-container">
            {props.imagePaths.map(path => 
                {
                    return (<div onClickCapture={(e)=>handleClickImage(path, e)} id="filtered-download-img-container">
                                <img className="filtered-download-img" src={path} />
                                <img id={path} className="X-overlay" src={'X.png'} />
                            </div>);
                }
            )}
            </div>);

}

export default function FilteredDownload(props) {
    const [imagePaths, setImagePaths] = useState(null);
    const [displayX, setDisplayX] = useState({})
    const [displayTrain, setDisplayTrain] = useState(false)

    // const cors_url = 'https://cors-anywhere.herokuapp.com/';
    const downloadAndFilterImagesAsZip = (imagePaths, e) => {
        e.preventDefault();
        setDisplayTrain(true);
        let wantedImages = imagePaths.filter(path => document.getElementById(path).style.display!='block');
        let unwantedImages = imagePaths.filter(path => !wantedImages.includes(path));
        fetch('http://127.0.0.1:5000/train', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ wantedImages: wantedImages, unwantedImages: unwantedImages })
        });
        setDisplayTrain(true);
    }

    useEffect(() => {
        getImagePaths(props.searchText, props.quantity, props.safeSearch)
        .then(imagePaths => {
            var temp = {};
            imagePaths.forEach(path => temp[path] = false);
            setDisplayX(temp);
            setImagePaths(imagePaths);
        })
        .catch(err => console.log(err));
    }, []);

    return(
        <div id="filtered-download-container">
            <HomeButton setDisplayFilteredDownload={props.setDisplayFilteredDownload}/>
            {displayTrain 
                ? "Training! Please be patient" 
                : 
                <div>
                    <Button handleClick={(e)=>downloadAndFilterImagesAsZip(imagePaths, e)}>Start training</Button>
                    <h1>Choose the pictures you like</h1>
                    {imagePaths  
                        ? <ImageCollectionWithSelect setDisplayX={setDisplayX} displayX={displayX} imagePaths={imagePaths} /> 
                        : "Loading"
                    }
                </div>
            }
        </div>
    )
}
export default function CatImage ({ imageRef, alt, id }) {
    const altText = `cat ${id} image`;

    return (
        <div className="m-3">
            <img src={ imageRef } alt={ alt } style={{ maxWidth: 250 + 'px' }}></img>
        </div>
    );
}
import { Player } from '@lottiefiles/react-lottie-player';

const Welcome = () => {
    return (
        <div className='w-full h-auto overflow-y-hidden'>
            <h1 className='mt-5 text-center items-center text-4xl font-extrabold font-nunito'>Welcome to Travel & Tour Website Management System</h1>
            <div>
                <Player
                    autoplay
                    loop
                    src="https://lottie.host/08cde321-2e4b-4f32-abf6-c43690fbea1d/uXH2pm0dL5.json"
                    style={{ height: 'auto', width: '90%'}}>
                </Player>
            </div>
        </div>

    );
}

export default Welcome;
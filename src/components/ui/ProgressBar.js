import "../../styles/ui/Button.scss";

export const ProgressBar = ({ progress }) => (
  <div className="progress-bar">
    <div className="progress" style={{ width: `${progress}%` }}></div>
  </div>
);

//use : {isLoading ? <ProgressBar progress={50} /> : renderGameBoard()}
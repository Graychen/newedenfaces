import React from 'react';
import Router fro 'react-router';
import routes fro './routes';

Router.run(routes,Router.HistoryLocation,function(Handler){
    React.render(<Handler />,document.getElementById('app'));
});

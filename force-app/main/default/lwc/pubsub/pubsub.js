var callbacks = {};
    const register = (eventName , callback) =>{
        console.log('callback register--:',callback);
        console.log('eventName register--:',eventName);
        if(!callbacks[eventName]){
            callbacks[eventName] = new Set();
        }
        callbacks[eventName].add(callback);
    };
    const unregister = (eventName , callback) =>{
        if(callbacks[eventName]){
            callbacks[eventName].delete(callback);
        }
    };
    const unregisterAll = () =>{
        callbacks = {};
    };
    const fire = (eventName , payload) =>{
        console.log('payload fire--:',payload);
        console.log('eventName fire--:',eventName);
        if(callbacks[eventName]){
            callbacks[eventName].forEach(callback => {
                console.log(' fire--:',callback);
                try {
                    callback(payload);
                }catch (error){
                    //fail silently
                }
            });
        }
    };
    export default{
        register,
        unregister,
        fire,
        unregisterAll
    };
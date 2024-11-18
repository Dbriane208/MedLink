export const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
        weekday: 'short', 
        month: 'short',   
        day: 'numeric',   
        year: 'numeric',  
        hour: '2-digit',  
        minute: '2-digit' 
    });
};
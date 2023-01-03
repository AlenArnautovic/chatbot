export interface MessageObject{
    content:string;
    messageLayout:MessageLayout;

}

export interface MessageLayout{
    position: string;
    edgedCornerL: string;
    edgedCornerR: string;
}

export const rightMessageLayout:MessageLayout = {
    position: 'flex justify-content-end',
    edgedCornerL: '',
    edgedCornerR: '1px'
}

export const leftMessageLayout: MessageLayout = {
    position: 'flex',
    edgedCornerL: '1px',
    edgedCornerR: ''
}
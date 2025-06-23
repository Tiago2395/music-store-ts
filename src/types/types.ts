export type Guitar = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
}

//Si fuese una interface sería 
//export interface CartItem extends Guitar
export type CartItem = Guitar & { 
    amount: number;
}

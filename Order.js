/**
 * An order that can be bid (buying), or ask (selling).
 */
export default class Order{

    constructor(id, type, price, currency, quantity, unitOfMeasurement, subject){
        this.id = id;
        this.type = type;
        this.price = price;
        this.currency = currency;
        this.quantity = quantity;
        this.unitOfMeasurement = unitOfMeasurement;
        this.subject = subject;
    }

    isBitcoin(){
        return this.currency === 'BTC';
    }

    /**
     * If share price is in EUR, returns it.
     * If the share price is in BTC, returns it in EUR.
     * We assume the current value of BTC is €15954.
     */
    btcToEur(){
        return this.isBitcoin() ? this.price*15954 : this.price;
    }

    /**
     * Finds the 1st matching order with:
     * - The subject of the orders are the same.
     * - A price equal or below our bid.
     * - A quantity that can be fulfilled.
     * @param {Order[]} orders 
     */
    matchBid(orders){
        for(const order of orders){
            const orderInstance = new Order(
                order.id, order.type,
                order.price, order.currency,
                order.quantity, order.unitOfMeasurement,
                order.subject
            );
            const sameSubject =this.subject === orderInstance.subject;
            const isPriceRight = this.btcToEur() >= orderInstance.price;
            const isEnough = this.unitOfMeasurement === orderInstance.unitOfMeasurement && this.quantity <= orderInstance.quantity;
            if(sameSubject && isPriceRight && isEnough){
                return orderInstance;
            }
        }
        return;
    }  
    
}

import mongoose, { Schema, Document } from 'mongoose'

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
  price: number
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId
  items: ICartItem[]
  total: number
  itemCount: number
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
})

const CartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

// Index for user cart lookups
CartSchema.index({ userId: 1 })

// Pre-save middleware to calculate totals
CartSchema.pre('save', function(next) {
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0)
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  next()
})

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema) 
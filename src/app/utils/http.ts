import { Response } from 'express'

export const ReturnJsonSuccess = (res: Response, value: any) => res.status(200).json({ status: true, value })

export const ReturnJsonError = (res: Response, error: string) => res.status(200).json({ status: false, error })

export const ReturnJsonValidation = (res: Response, validation: any[]) => res.status(200).json({ status: false, validation })

export const ReturnJsonException = (res: Response, message: string) => res.status(500).json({ message })
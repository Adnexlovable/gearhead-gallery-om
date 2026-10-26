import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface EnquiryNotificationProps {
  product?: string
  name?: string
  contact?: string
  message?: string | null
}

const EnquiryNotification = ({ product = 'A product', name = 'A customer', contact = '', message }: EnquiryNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New enquiry about {product}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>GearHead RC · Inbox</Text>
        <Heading style={h1}>New enquiry</Heading>
        <Section style={card}>
          <Row label="About" value={product} />
          <Row label="Name" value={name} />
          <Row label="Email or WhatsApp" value={contact} />
          {message ? <Row label="Message" value={message} /> : null}
        </Section>
        <Text style={footer}>This enquiry is also saved in your admin dashboard under Inbox.</Text>
      </Container>
    </Body>
  </Html>
)

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={row}>
      <span style={rowLabel}>{label}</span>
      <br />
      {value}
    </Text>
  )
}

export const template = {
  component: EnquiryNotification,
  subject: (d: Record<string, any>) => `New enquiry — ${d.product ?? 'GearHead RC'}`,
  displayName: 'Owner: new enquiry',
  previewData: {
    product: 'Jeep Wrangler Rubicon RC',
    name: 'Sara Al-Balushi',
    contact: 'sara@example.com',
    message: 'Is this in stock, and can I test-drive it on the track?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px' }
const eyebrow = { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#B8701A', margin: '0 0 8px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1C1A17', margin: '0 0 20px' }
const card = { border: '1px solid #E8962E', borderRadius: '8px', padding: '16px 20px' }
const row = { fontSize: '14px', color: '#1C1A17', lineHeight: '1.5', margin: '0 0 12px', whiteSpace: 'pre-line' as const }
const rowLabel = { fontSize: '11px', color: '#7A746B', textTransform: 'uppercase' as const, letterSpacing: '1px' }
const footer = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }

import * as React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface BookingNotificationProps {
  experience?: string
  visitDate?: string
  visitTime?: string
  party?: string
  name?: string
  contact?: string
  notes?: string | null
}

const BookingNotification = ({
  experience = 'Visit',
  visitDate = '',
  visitTime = '',
  party = '',
  name = 'A visitor',
  contact = '',
  notes,
}: BookingNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New visit request from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>GearHead RC · Book a Visit</Text>
        <Heading style={h1}>New visit request</Heading>
        <Section style={card}>
          <Row label="Visit type" value={experience} />
          <Row label="Date" value={visitDate} />
          <Row label="Time" value={`${visitTime} (Muscat time)`} />
          <Row label="Guests" value={party} />
          <Row label="Name" value={name} />
          <Row label="Email or WhatsApp" value={contact} />
          {notes ? <Row label="Notes" value={notes} /> : null}
        </Section>
        <Text style={footer}>Reply to the visitor to confirm. This request is also saved in your admin dashboard under Bookings.</Text>
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
  component: BookingNotification,
  subject: (d: Record<string, any>) => `New visit request — ${d.name ?? 'visitor'} · ${d.visitDate ?? ''} ${d.visitTime ?? ''}`.trim(),
  displayName: 'Owner: new visit request',
  previewData: {
    experience: 'Private Viewing',
    visitDate: '2026-12-02',
    visitTime: '16:00',
    party: '2',
    name: 'Khalid Al-Hinai',
    contact: '+968 9000 0000',
    notes: 'Interested in the Defender RC.',
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

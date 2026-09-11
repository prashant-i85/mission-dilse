import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/public/Hero'
import Metrics from '@/components/public/Metrics'
import Founder from '@/components/public/Founder'
import Works from '@/components/public/Works'
import Gallery from '@/components/public/Gallery'
import About from '@/components/public/About'
import Contact from '@/components/public/Contact'

export const dynamic = 'force-dynamic'

// Mock data fallbacks for developer preview when Supabase is not configured yet
const mockWorks = [
  {
    id: 'mock-1',
    title: 'Food Distribution Drive & Field Video',
    description: 'Watch video footage from our latest field drive! We successfully distributed over 500 hot meals to daily wage workers and children in the local community. Special thanks to our team of dedicated volunteers.',
    cover_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Free Health Checkup Camp',
    description: 'Organized a free health and eye checkup camp in collaboration with local medical institutes. Over 200 residents received free consultations, basic medical tests, and free prescription glasses.',
    cover_image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Back to School Supply Distribution',
    description: 'Provided school bags, notebooks, and writing materials to 150 children in the local slums to support their education and encourage regular school attendance.',
    cover_image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
]

const mockPhotos = [
  {
    id: 'mock-p1',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=60',
    caption: 'Education program launch ceremony',
  },
  {
    id: 'mock-p2',
    image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop&q=60',
    caption: 'Volunteers distributing food packets',
  },
  {
    id: 'mock-p3',
    image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=60',
    caption: 'Basic health checkup for senior citizens',
  },
  {
    id: 'mock-p4',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=60',
    caption: 'Classroom setup at the new community school',
  },
]

const mockAbout = {
  heading: 'About Mission Dilse',
  body: 'Mission Dilse is a non-profit organization started with a single, clear vision: to bring hope, relief, and opportunity to the most vulnerable sections of our society.\n\nWe believe that true service comes from the heart ("Dilse"). Our primary focus areas include basic child education support, nutritional food security, health camps, and building sustainable community capabilities.\n\nOver the past years, we have reached out to thousands of individuals, bringing smiles and facilitating change. We work with a network of local volunteers and donors who believe in creating a compassionate world.',
}

const mockContact = {
  email: 'info@missiondilse.org',
  phone: '+91 98765 43210',
  address: '12, Community Centre, Okhla Phase 3, New Delhi, India',
  extra_info: 'Our team is available from Monday to Saturday, 10 AM to 6 PM. For volunteer applications or drop-off donation queries, please email us directly.',
}

export default async function PublicHomePage() {
  let works = mockWorks
  let photos = mockPhotos
  let about = mockAbout
  let contact = mockContact
  let hero = {
    ngo_name: 'MISSION DILSE',
    tagline: 'COMPASSION IN ACTION',
    slogans: ['EQUAL OPPORTUNITY', 'CHILD EDUCATION', 'COMMUNITY DEVOTION'],
    background_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
  }

  let homepageText = {
    works_heading: 'WHAT WE DO',
    works_description: 'We support communities through direct aid, sponsor education programs, and lead campaigns—translating compassionate support into real-world, lasting change.',
    gallery_heading: 'HEAR OUR STORIES',
    gallery_description: 'Real faces from the front lines of change. These are the people shaping their communities—and the future.',
    contact_heading: 'GET IN TOUCH',
    contact_description: 'Have questions, want to partner, or support our operations? Connect with us or support our cause below.',
    button_1_text: 'SUPPORT US',
    button_2_text: 'SHARE YOUR STORY',
    upi_id: 'praveenverma212005-1@okhdfcbank',
    payee_name: 'Mission Dilse',
    metric_1_val: '5,000+',
    metric_1_label: 'Meals Distributed',
    metric_1_desc: 'Healthy meals cooked & served',
    metric_2_val: '150+',
    metric_2_label: 'Kids Educated',
    metric_2_desc: 'Sponsorships & school kits',
    metric_3_val: '25+',
    metric_3_label: 'Active Projects',
    metric_3_desc: 'Local development initiatives',
    metric_4_val: '12A / 80G',
    metric_4_label: 'Certified NGO',
    metric_4_desc: 'Tax exemption tax deductible'
  }

  let showWorks = true
  let showGallery = true
  let showAbout = true
  let showContact = true

  let isUsingMock = false

  try {
    const supabase = await createClient()

    // 1. Fetch settings
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('section_name, is_visible')

    if (settingsError || !settings || settings.length === 0) {
      isUsingMock = true
    } else {
      showWorks = settings.find((s) => s.section_name === 'works')?.is_visible ?? true
      showGallery = settings.find((s) => s.section_name === 'gallery')?.is_visible ?? true
      showAbout = settings.find((s) => s.section_name === 'about')?.is_visible ?? true
      showContact = settings.find((s) => s.section_name === 'contact')?.is_visible ?? true

      // 2. Fetch Works if visible
      if (showWorks) {
        const { data: dbWorks } = await supabase
          .from('works')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })
        
        if (dbWorks) works = dbWorks
      }

      // 3. Fetch Photos if visible
      if (showGallery) {
        const { data: dbPhotos } = await supabase
          .from('photos')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })
        
        if (dbPhotos) photos = dbPhotos
      }

      // 4. Fetch About text
      if (showAbout) {
        const { data: dbAbout } = await supabase
          .from('about_content')
          .select('*')
          .eq('id', 1)
          .single()
        
        if (dbAbout) about = dbAbout
      }

      // 5. Fetch Contact text
      if (showContact) {
        const { data: dbContact } = await supabase
          .from('contact_content')
          .select('*')
          .eq('id', 1)
          .single()
        
        if (dbContact) contact = dbContact
      }

      // 6. Fetch Hero content
      const { data: dbHero } = await supabase
        .from('hero_content')
        .select('*')
        .eq('id', 1)
        .single()
      
      if (dbHero) {
        hero = {
          ngo_name: dbHero.ngo_name,
          tagline: dbHero.tagline,
          slogans: dbHero.slogans || hero.slogans,
          background_image_url: dbHero.background_image_url || hero.background_image_url,
        }
      }

      // 7. Fetch Homepage Text Copy dynamically
      try {
        const { data: dbCopy } = await supabase
          .from('homepage_text')
          .select('*')
          .eq('id', 1)
          .single()
        
        if (dbCopy) homepageText = dbCopy
      } catch (copyErr) {
        console.warn('homepage_text table not configured yet. Using default copy fallbacks.')
      }
    }

  } catch (err) {
    console.warn('Supabase not configured or failed to connect. Falling back to mock data preview.', err)
    isUsingMock = true
  }

  // Adjust visibility of sections
  const renderWorks = showWorks && works.length > 0
  const renderGallery = showGallery && photos.length > 0
  const renderAbout = showAbout && about
  const renderContact = showContact && contact

  return (
    <div className="flex flex-col w-full min-h-screen">
      {isUsingMock && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-2 text-center sticky top-0 z-55 shadow-md">
          ⚠️ Running in Demo Preview Mode (Supabase environment variables not configured).
        </div>
      )}

      {/* Hero Section */}
      <Hero 
        showWorks={renderWorks} 
        heroData={hero} 
        button1Text={homepageText.button_1_text}
        button2Text={homepageText.button_2_text}
      />

      {/* Metrics Section */}
      <Metrics textCopy={homepageText} />

      {/* Founder Section */}
      <Founder />

      {/* Works Section */}
      {renderWorks && (
        <Works 
          works={works} 
          heading={homepageText.works_heading} 
          description={homepageText.works_description} 
        />
      )}

      {/* Gallery Section */}
      {renderGallery && (
        <Gallery 
          photos={photos} 
          heading={homepageText.gallery_heading} 
          description={homepageText.gallery_description} 
        />
      )}

      {/* About Section */}
      {renderAbout && <About heading={about.heading} body={about.body} />}

      {/* Contact Section */}
      {renderContact && (
        <Contact
          email={contact.email}
          phone={contact.phone}
          address={contact.address}
          extra_info={contact.extra_info}
          heading={homepageText.contact_heading}
          description={homepageText.contact_description}
          upiId={homepageText.upi_id}
          payeeName={homepageText.payee_name}
        />
      )}
    </div>
  )
}

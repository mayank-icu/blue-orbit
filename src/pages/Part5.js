import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';

// --- OCEAN DATA ---
const oceanData = [
  // ##########################################
  // ### Sea Level Rise Hotspots
  // ##########################################
  // ## Data Structure:
  // ## total_rise_since_2000_mm: Total rise in millimeters over 25 years.
  // ## rate_2000_mm_yr: Approximate rate of rise per year around 2000.
  // ## rate_2025_mm_yr: Approximate rate of rise per year now.
  // ##########################################

  // ## Major Hotspots & Megacities
  {lat: -2.0, lng: 160.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 250, rate_2000_mm_yr: 6.5, rate_2025_mm_yr: 12.0, region: "Western Pacific Warm Pool", label: "The rate of rise here has nearly doubled, from ~6.5 mm/year in 2000 to ~12.0 mm/year today, as trade winds and ocean cycles continue to pile up warm water."},
  {lat: 35.0, lng: -75.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 130, rate_2000_mm_yr: 3.5, rate_2025_mm_yr: 6.5, region: "U.S. East Coast (Cape Hatteras)", label: "Rise has accelerated from ~3.5 mm/year to ~6.5 mm/year due to a slowing Gulf Stream and ongoing land subsidence, significantly increasing flood risk."},
  {lat: -6.1, lng: 106.8, dataType: "seaLevelRise", total_rise_since_2000_mm: 180, rate_2000_mm_yr: 5.0, rate_2025_mm_yr: 8.5, region: "Jakarta, Indonesia", label: "Global sea level rise, which has accelerated from ~5.0 to ~8.5 mm/year here, is critically compounded by rapid land sinking from groundwater extraction."},
  {lat: 24.0, lng: 88.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 140, rate_2000_mm_yr: 4.0, rate_2025_mm_yr: 7.0, region: "Bay of Bengal", label: "The rate of sea level rise has increased from ~4.0 to ~7.0 mm/year, placing the low-lying and densely populated deltas at an ever-greater risk of storm surges and saltwater intrusion."},
  {lat: 30.0, lng: -85.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 125, rate_2000_mm_yr: 3.2, rate_2025_mm_yr: 6.0, region: "Gulf of Mexico", label: "Fueled by significant ocean warming, the rise rate has nearly doubled from ~3.2 mm/year to ~6.0 mm/year, increasing the destructive potential of hurricanes."},
  {lat: 31.0, lng: 31.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 120, rate_2000_mm_yr: 3.0, rate_2025_mm_yr: 5.8, region: "Nile Delta, Egypt", label: "The combination of accelerating sea level rise (from ~3.0 to ~5.8 mm/year) and continued delta subsidence poses a growing threat to Egypt's agricultural heartland."},
  {lat: 6.5, lng: 3.4, dataType: "seaLevelRise", total_rise_since_2000_mm: 130, rate_2000_mm_yr: 3.5, rate_2025_mm_yr: 6.5, region: "Lagos, Nigeria", label: "Africa's largest city faces a worsening threat as the rate of rise has climbed from ~3.5 to ~6.5 mm/year, amplifying the risks of coastal erosion and flooding."},
  {lat: 29.9, lng: -90.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 200, rate_2000_mm_yr: 6.0, rate_2025_mm_yr: 10.0, region: "New Orleans, USA", label: "In this hotspot, the relative sea level rise rate has increased from ~6.0 to ~10.0 mm/year due to the double impact of global rise and rapid delta subsidence."},
  {lat: 25.7, lng: -80.2, dataType: "seaLevelRise", total_rise_since_2000_mm: 145, rate_2000_mm_yr: 4.2, rate_2025_mm_yr: 7.5, region: "Miami, USA", label: "The rate of rise has accelerated from ~4.2 to ~7.5 mm/year, leading to a dramatic increase in the frequency of 'sunny-day' flooding as seawater pushes up through the porous limestone bedrock."},
  {lat: 22.3, lng: 114.1, dataType: "seaLevelRise", total_rise_since_2000_mm: 135, rate_2000_mm_yr: 3.8, rate_2025_mm_yr: 6.8, region: "Pearl River Delta, China", label: "Home to several megacities, this region has seen the rise rate increase from ~3.8 to ~6.8 mm/year, heightening the vulnerability of its vast, low-lying infrastructure."},
  {lat: 13.7, lng: 100.5, dataType: "seaLevelRise", total_rise_since_2000_mm: 160, rate_2000_mm_yr: 4.5, rate_2025_mm_yr: 8.0, region: "Bangkok, Thailand", label: "The rising waters of the Gulf of Thailand, accelerating from ~4.5 to ~8.0 mm/year, combine with severe land subsidence to threaten this sinking megacity."},
  {lat: 10.8, lng: 106.7, dataType: "seaLevelRise", total_rise_since_2000_mm: 155, rate_2000_mm_yr: 4.2, rate_2025_mm_yr: 7.8, region: "Ho Chi Minh City, Vietnam", label: "The rise rate in the Mekong Delta has quickened from ~4.2 to ~7.8 mm/year, pushing saltwater further inland and jeopardizing the region's rice paddies and freshwater supplies."},
  {lat: 51.5, lng: 0.1, dataType: "seaLevelRise", total_rise_since_2000_mm: 110, rate_2000_mm_yr: 2.8, rate_2025_mm_yr: 5.2, region: "London, United Kingdom", label: "As the rate of rise has increased from ~2.8 to ~5.2 mm/year, the Thames Barrier must be closed more frequently to protect the city from increasingly high tides."},

  // ## Pacific Island Nations
  {lat: -8.5, lng: 179.2, dataType: "seaLevelRise", total_rise_since_2000_mm: 260, rate_2000_mm_yr: 7.0, rate_2025_mm_yr: 12.5, region: "Tuvalu, Polynesia", label: "Facing an existential threat, the rate of rise has accelerated dramatically from ~7.0 to ~12.5 mm/year, causing constant flooding and saltwater contamination of its freshwater lens."},
  {lat: 12.0, lng: 123.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 220, rate_2000_mm_yr: 6.0, rate_2025_mm_yr: 11.0, region: "Philippines Archipelago", label: "The rise rate has nearly doubled from ~6.0 to ~11.0 mm/year, drastically increasing the damage caused by storm surges from the powerful typhoons that frequent the area."},
  {lat: 7.1, lng: 171.3, dataType: "seaLevelRise", total_rise_since_2000_mm: 280, rate_2000_mm_yr: 7.5, rate_2025_mm_yr: 13.5, region: "Marshall Islands", label: "With the rise rate jumping from ~7.5 to ~13.5 mm/year, waves now regularly overwash parts of the atolls during king tides, threatening homes and vital infrastructure."},
  {lat: 1.8, lng: -157.3, dataType: "seaLevelRise", total_rise_since_2000_mm: 270, rate_2000_mm_yr: 7.2, rate_2025_mm_yr: 13.0, region: "Kiribati", label: "The accelerating sea level rise, from ~7.2 to ~13.0 mm/year, is shrinking the islands and contaminating freshwater sources, forcing the government to plan for eventual mass relocation."},
  {lat: -9.6, lng: 160.1, dataType: "seaLevelRise", total_rise_since_2000_mm: 240, rate_2000_mm_yr: 6.5, rate_2025_mm_yr: 11.5, region: "Solomon Islands", label: "The dramatic acceleration of sea level rise from ~6.5 to ~11.5 mm/year has already led to the complete submersion of at least five reef islands, a stark visual of the ongoing crisis."},
  {lat: -17.7, lng: 177.9, dataType: "seaLevelRise", total_rise_since_2000_mm: 210, rate_2000_mm_yr: 5.8, rate_2025_mm_yr: 10.5, region: "Fiji", label: "As the rate of rise has increased from ~5.8 to ~10.5 mm/year, dozens of coastal villages have been forced to relocate to higher ground, making Fiji a global leader in climate relocation efforts."},

  // ## Other Vulnerable Coasts
  {lat: 3.0, lng: -45.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 135, rate_2000_mm_yr: 3.6, rate_2025_mm_yr: 6.8, region: "Northeast South America", label: "The accelerating rise from ~3.6 to ~6.8 mm/year is causing severe coastal erosion and threatening mangrove forests that protect the coastlines of Brazil and the Guianas."},
  {lat: 52.5, lng: 5.5, dataType: "seaLevelRise", total_rise_since_2000_mm: 105, rate_2000_mm_yr: 2.5, rate_2025_mm_yr: 5.0, region: "The Netherlands", label: "The local rate of sea level rise has doubled from ~2.5 to ~5.0 mm/year, placing increasing strain on the nation's world-renowned system of dikes, dunes, and storm barriers."},
  {lat: 45.4, lng: 12.3, dataType: "seaLevelRise", total_rise_since_2000_mm: 115, rate_2000_mm_yr: 2.8, rate_2025_mm_yr: 5.5, region: "Venice, Italy", label: "The increasing rate of rise in the Adriatic, from ~2.8 to ~5.5 mm/year, combined with the city's subsidence, has made the severe 'acqua alta' floods an increasingly common event."},
  {lat: -30.0, lng: -55.0, dataType: "seaLevelRise", total_rise_since_2000_mm: 125, rate_2000_mm_yr: 3.2, rate_2025_mm_yr: 6.2, region: "Río de la Plata Basin", label: "With the rate of rise quickening from ~3.2 to ~6.2 mm/year, the risk of severe storm surges pushing up the estuary and flooding coastal cities like Buenos Aires has grown significantly."},

  // ##########################################
  // ### Ice Melt Zones
  // ##########################################
  // ## Data Structure:
  // ## value_2000_Gt_yr: Approximate ice loss in Gigatonnes per year around 2000.
  // ## value_2025_Gt_yr: Approximate ice loss in Gigatonnes per year now.
  // ##########################################
  
  // ## Major Ice Sheets
  {lat: 72.0, lng: -40.0, dataType: "iceMelt", value_2000_Gt_yr: 80, value_2025_Gt_yr: 270, region: "Greenland Ice Sheet", label: "Ice loss has more than tripled, accelerating from ~80 Gt/year around 2000 to ~270 Gt/year today, as warmer air and ocean temperatures drive melt on a massive scale."},
  {lat: -80.0, lng: 0.0, dataType: "iceMelt", value_2000_Gt_yr: 50, value_2025_Gt_yr: 150, region: "Antarctic Ice Sheet", label: "The rate of ice loss has tripled, from ~50 Gt/year in 2000 to ~150 Gt/year now, primarily driven by the rapid acceleration of glaciers in West Antarctica and the Peninsula."},
  {lat: -75.0, lng: -100.0, dataType: "iceMelt", value_2000_Gt_yr: 40, value_2025_Gt_yr: 110, region: "West Antarctic Ice Sheet (WAIS)", label: "Considered the most unstable part of the continent, its ice loss has accelerated from ~40 Gt/year to ~110 Gt/year as warm ocean currents melt its marine-based glaciers from below."},
  {lat: -65.0, lng: -62.0, dataType: "iceMelt", value_2000_Gt_yr: 10, value_2025_Gt_yr: 35, region: "Antarctic Peninsula", label: "In one of the fastest-warming places on Earth, ice loss has tripled from ~10 Gt/year to ~35 Gt/year, marked by the dramatic collapse of ice shelves that allowed glaciers to speed up."},
  
  // ## Critical Glaciers
  {lat: -75.0, lng: -106.5, dataType: "iceMelt", value_2000_Gt_yr: 20, value_2025_Gt_yr: 50, region: "Thwaites Glacier, Antarctica", label: "The melt rate of the 'Doomsday Glacier' has more than doubled, from ~20 Gt/year to ~50 Gt/year, as its grounding line retreats and fractures, signaling potential instability."},
  {lat: -75.2, lng: -100.0, dataType: "iceMelt", value_2000_Gt_yr: 25, value_2025_Gt_yr: 55, region: "Pine Island Glacier, Antarctica", label: "Its ice loss has more than doubled from ~25 Gt/year to ~55 Gt/year. The retreat of its grounding line is one of the clearest signs of oceanic warming impacting Antarctica."},
  {lat: 69.1, lng: -49.8, dataType: "iceMelt", value_2000_Gt_yr: 15, value_2025_Gt_yr: 30, region: "Jakobshavn Isbræ, Greenland", label: "The melt rate of this key glacier doubled from ~15 Gt/year to ~30 Gt/year over this period, making it a primary contributor to Greenland's share of sea level rise."},

  // ## Mountain Glaciers & Ice Caps
  {lat: 61.0, lng: -145.0, dataType: "iceMelt", value_2000_Gt_yr: 50, value_2025_Gt_yr: 75, region: "Alaskan Coastal Glaciers", label: "The rate of melt has increased by 50%, from ~50 Gt/year to ~75 Gt/year, making these glaciers one of the largest contributors to sea level rise outside the main ice sheets."},
  {lat: -50.0, lng: -73.0, dataType: "iceMelt", value_2000_Gt_yr: 15, value_2025_Gt_yr: 25, region: "Patagonian Ice Fields", label: "Ice loss has accelerated from ~15 Gt/year to ~25 Gt/year, causing a visible retreat of glacier tongues and the formation of new proglacial lakes."},
  {lat: 28.5, lng: 86.0, dataType: "iceMelt", value_2000_Gt_yr: 8, value_2025_Gt_yr: 15, region: "Himalayan Glaciers (HKH Region)", label: "The melting of the 'Third Pole' has nearly doubled, from ~8 Gt/year to ~15 Gt/year, threatening the long-term water security for more than a billion people downstream."},
  {lat: 46.5, lng: 8.5, dataType: "iceMelt", value_2000_Gt_yr: 3, value_2025_Gt_yr: 5, region: "The European Alps", label: "The rate of ice loss has increased from ~3 Gt/year to ~5 Gt/year. The iconic glaciers of the Alps are now losing volume at an unprecedented and visually dramatic rate."},
  {lat: 80.0, lng: 80.0, dataType: "iceMelt", value_2000_Gt_yr: 20, value_2025_Gt_yr: 40, region: "Russian Arctic Islands", label: "Ice loss from these remote ice caps has doubled from ~20 Gt/year to ~40 Gt/year as Arctic amplification drives temperatures up faster than the global average."},
  {lat: 78.0, lng: 20.0, dataType: "iceMelt", value_2000_Gt_yr: 5, value_2025_Gt_yr: 10, region: "Svalbard Archipelago", label: "In this Arctic warming hotspot, the glacier melt rate has doubled from ~5 Gt/year to ~10 Gt/year, contributing to local sea level rise and impacting fjord ecosystems."},
  {lat: 79.0, lng: -85.0, dataType: "iceMelt", value_2000_Gt_yr: 15, value_2025_Gt_yr: 30, region: "Canadian Arctic Archipelago", label: "Ice loss from this vast collection of glaciers and ice caps has doubled from ~15 Gt/year to ~30 Gt/year, confirming that melt is accelerating across the entire Arctic region."},
  {lat: 64.2, lng: -19.0, dataType: "iceMelt", value_2000_Gt_yr: 6, value_2025_Gt_yr: 11, region: "Vatnajökull Ice Cap, Iceland", label: "The melt rate of Europe's largest ice cap has almost doubled, from ~6 Gt/year to ~11 Gt/year, with climate change visibly shrinking its many outlet glaciers."},
  {lat: -43.5, lng: 170.1, dataType: "iceMelt", value_2000_Gt_yr: 1, value_2025_Gt_yr: 2, region: "Southern Alps, New Zealand", label: "The rate of ice loss from these maritime glaciers has doubled, from ~1 Gt/year to ~2 Gt/year, causing a significant and well-documented retreat of famous glaciers like Franz Josef."},
  {lat: 43.0, lng: 42.5, dataType: "iceMelt", value_2000_Gt_yr: 0.5, value_2025_Gt_yr: 1, region: "Caucasus Mountains", label: "The small but important glaciers of the Caucasus are losing ice twice as fast as they were in 2000, with the melt rate increasing from ~0.5 Gt/year to ~1 Gt/year, affecting regional water supplies."},

  // ##########################################
  // ### Ocean Acidification Hotspots
  // ##########################################
  // ## Data Structure:
  // ## pH_2000: Approximate ocean pH value around 2000.
  // ## pH_2025: Approximate ocean pH value now.
  // ## acidity_increase_percent: Calculated increase in H+ ions since 2000.
  // ##########################################

  // ## Coral Reef Systems
  {lat: -18.0, lng: 147.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.06, acidity_increase_percent: 12, region: "Great Barrier Reef, Australia", label: "The pH has dropped from ~8.11 to ~8.06, a 12% increase in acidity since 2000. This chemical stress inhibits coral skeleton growth, making them more vulnerable to bleaching."},
  {lat: 15.0, lng: -85.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.06, acidity_increase_percent: 12, region: "Mesoamerican Reef", label: "A pH drop from ~8.11 to ~8.06 (+12% acidity) is weakening coral structures, threatening the second-largest barrier reef and the coastal protection it provides."},
  {lat: 25.0, lng: 125.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.05, acidity_increase_percent: 12, region: "Coral Triangle", label: "In the world's epicenter of marine biodiversity, pH has fallen from ~8.10 to ~8.05. This 12% increase in acidity threatens the foundational coral ecosystems."},
  {lat: 6.0, lng: 73.0, dataType: "acidification", pH_2000: 8.12, pH_2025: 8.07, acidity_increase_percent: 12, region: "Maldives Atolls", label: "The pH has dropped from ~8.12 to ~8.07 since 2000, a 12% increase in acidity that dissolves the very coral reefs that form and protect these low-lying islands."},
  {lat: 22.0, lng: 38.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.03, acidity_increase_percent: 12, region: "Red Sea Reefs", label: "Even in this unique high-temperature environment, pH has fallen from ~8.08 to ~8.03 (+12% acidity), adding chemical stress to its otherwise resilient coral communities."},
  {lat: 20.0, lng: -75.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.06, acidity_increase_percent: 12, region: "Caribbean Sea", label: "A drop in pH from ~8.11 to ~8.06 since 2000 (+12% acidity) is shifting the balance from reef growth to erosion, endangering thousands of vital patch reefs."},
  {lat: 21.0, lng: -157.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.05, acidity_increase_percent: 12, region: "Hawaiian Islands Reefs", label: "The pH around Hawaii has dropped from ~8.10 to ~8.05 (+12% acidity), slowing coral growth and threatening the health of these culturally and economically important ecosystems."},
  {lat: 25.0, lng: -78.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.06, acidity_increase_percent: 12, region: "Florida Keys, USA", label: "The pH has fallen from ~8.11 to ~8.06 (+12% acidity), a major stressor that is hindering efforts to restore the degraded and vital barrier reef of the continental US."},

  // ## High-Latitude & Cold Water Zones
  {lat: 65.0, lng: -20.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.02, acidity_increase_percent: 15, region: "North Atlantic (Irminger Sea)", label: "Cold water absorbs more CO₂, leading to a rapid pH drop from ~8.08 to ~8.02. This 15% increase in acidity poses a severe threat to shell-building plankton at the base of the food web."},
  {lat: -60.0, lng: -150.0, dataType: "acidification", pH_2000: 8.09, pH_2025: 8.03, acidity_increase_percent: 15, region: "Southern Ocean", label: "The pH in this critical carbon sink has dropped from ~8.09 to ~8.03 (+15% acidity), making waters corrosive to pteropods ('sea butterflies'), a key food for Antarctic fish and whales."},
  {lat: 75.0, lng: 0.0, dataType: "acidification", pH_2000: 8.07, pH_2025: 8.00, acidity_increase_percent: 18, region: "Arctic Ocean", label: "The Arctic is acidifying faster than any other ocean, with pH dropping from ~8.07 to ~8.00. This 18% increase in acidity is a direct result of increased CO₂ absorption from melting sea ice."},
  {lat: 60.0, lng: -170.0, dataType: "acidification", pH_2000: 8.06, pH_2025: 7.99, acidity_increase_percent: 18, region: "Bering Sea", label: "In this acidification hotspot, pH has plummeted from ~8.06 to ~7.99 (+18% acidity), threatening the ability of valuable king crabs and pollock to form and maintain their shells."},
  {lat: 45.0, lng: 145.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.02, acidity_increase_percent: 15, region: "Sea of Okhotsk", label: "The pH has dropped from ~8.08 to ~8.02 (+15% acidity) due to cold temperatures and sea ice dynamics, impacting its rich fisheries and marine mammal populations."},
  {lat: 43.0, lng: -68.0, dataType: "acidification", pH_2000: 8.07, pH_2025: 8.01, acidity_increase_percent: 15, region: "Gulf of Maine", label: "This rapidly warming and acidifying gulf has seen its pH drop from ~8.07 to ~8.01 (+15% acidity), endangering its iconic lobster and scallop industries."},
  {lat: 58.0, lng: -152.0, dataType: "acidification", pH_2000: 8.07, pH_2025: 8.01, acidity_increase_percent: 15, region: "Gulf of Alaska", label: "Glacial meltwater has accelerated acidification, with pH dropping from ~8.07 to ~8.01 since 2000. This 15% acidity increase threatens world-famous salmon and crab fisheries."},
  {lat: 75.0, lng: 45.0, dataType: "acidification", pH_2000: 8.06, pH_2025: 7.99, acidity_increase_percent: 18, region: "Barents Sea", label: "As warmer Atlantic water enters the Arctic, its pH has dropped from ~8.06 to ~7.99 (+18% acidity), with observed impacts on the shells of microorganisms at the base of the food web."},
  {lat: 58.0, lng: 5.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.04, acidity_increase_percent: 15, region: "North Sea", label: "The pH in this productive sea has dropped from ~8.10 to ~8.04 (+15% acidity), threatening shellfish populations and the larval stages of important commercial fish like cod."},
  {lat: -58.0, lng: -45.0, dataType: "acidification", pH_2000: 8.09, pH_2025: 8.03, acidity_increase_percent: 15, region: "Scotia Sea", label: "A biological hotspot for krill, the sea's pH has fallen from ~8.09 to ~8.03 (+15% acidity), a change that could impact krill development and the entire Antarctic food chain."},
  {lat: 48.0, lng: -62.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.02, acidity_increase_percent: 15, region: "Gulf of St. Lawrence", label: "The pH in this large estuary has dropped from ~8.08 to ~8.02 (+15% acidity) due to inflows of cold, CO₂-rich Arctic water, creating challenging conditions for its snow crabs and lobsters."},

  // ## Upwelling & Coastal Systems
  {lat: 48.0, lng: -125.0, dataType: "acidification", pH_2000: 8.07, pH_2025: 8.01, acidity_increase_percent: 15, region: "Pacific Northwest Upwelling Zone", label: "Naturally acidic deep water is now more corrosive. The pH has dropped from ~8.07 to ~8.01 (+15% acidity), causing widespread failures in oyster hatcheries and harming marine life."},
  {lat: 38.0, lng: -120.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.02, acidity_increase_percent: 15, region: "California Current System", label: "The pH of upwelled water has dropped from ~8.08 to ~8.02 (+15% acidity), threatening the Dungeness crab fishery as acidic water can damage the shells of their larvae."},
  {lat: -30.0, lng: 15.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.04, acidity_increase_percent: 15, region: "Benguela Current Upwelling", label: "The pH in this nutrient-rich upwelling system has fallen from ~8.10 to ~8.04 (+15% acidity), affecting the entire marine food web, from plankton to the large fish that feed on them."},
  {lat: 21.0, lng: -17.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.05, acidity_increase_percent: 12, region: "Mauritanian Upwelling", label: "The pH in this major upwelling system has dropped from ~8.10 to ~8.05 (+12% acidity), threatening the base of the food web that supports one of West Africa's most important fisheries."},
  {lat: 41.0, lng: -9.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.05, acidity_increase_percent: 15, region: "Iberian Upwelling System", label: "The pH of upwelled water has dropped from ~8.11 to ~8.05 (+15% acidity), which can harm the early life stages of the sardines and anchovies that are vital to the local economy."},
  
  // ## Semi-Enclosed Seas & River Deltas
  {lat: 35.0, lng: 20.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.05, acidity_increase_percent: 12, region: "Mediterranean Sea", label: "The pH in this enclosed sea has dropped from ~8.10 to ~8.05 (+12% acidity), puttingits unique ecosystems, like the vital Posidonia seagrass meadows, under significant chemical stress."},
  {lat: 65.0, lng: 110.0, dataType: "acidification", pH_2000: 8.05, pH_2025: 7.98, acidity_increase_percent: 18, region: "Siberian Shelf Seas", label: "Massive freshwater runoff and melting sea ice have caused a severe drop in pH from ~8.05 to ~7.98 (+18% acidity), drastically reducing the sea's capacity to buffer against acidification."},
  {lat: 1.0, lng: -45.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.06, acidity_increase_percent: 12, region: "Amazon River Plume", label: "The massive freshwater outflow from the Amazon lowers the buffering capacity of the Atlantic, resulting in a pH drop from ~8.11 to ~8.06 (+12% acidity) in the affected zone."},
  {lat: 29.0, lng: -89.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.02, acidity_increase_percent: 15, region: "Mississippi River Delta", label: "The pH has fallen from ~8.08 to ~8.02 (+15% acidity) due to the combined effects of CO₂ absorption and nutrient runoff, harming the region's vital oyster and shrimp fisheries."},
  {lat: 56.0, lng: 20.0, dataType: "acidification", pH_2000: 8.05, pH_2025: 7.98, acidity_increase_percent: 18, region: "Baltic Sea", label: "This brackish, semi-enclosed sea is highly vulnerable, with its pH dropping from ~8.05 to ~7.98 since 2000. This 18% increase in acidity threatens its unique, low-salinity ecosystem."},
  {lat: 43.0, lng: 35.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.04, acidity_increase_percent: 15, region: "Black Sea", label: "The pH in this semi-enclosed basin has dropped from ~8.10 to ~8.04 (+15% acidity), a significant change that can impact its unique ecosystem and important fisheries."},
  {lat: 26.0, lng: 52.0, dataType: "acidification", pH_2000: 8.07, pH_2025: 8.02, acidity_increase_percent: 12, region: "Persian Gulf", label: "In this high-temperature, high-salinity environment, the pH has dropped from ~8.07 to ~8.02 (+12% acidity), adding another layer of severe stress to its strained coral communities."},
  
  // ## Other Notable Regions
  {lat: -40.0, lng: 175.0, dataType: "acidification", pH_2000: 8.10, pH_2025: 8.04, acidity_increase_percent: 15, region: "Tasman Sea (New Zealand)", label: "The pH has fallen from ~8.10 to ~8.04 (+15% acidity), threatening New Zealand's unique marine ecosystems and its economically important aquaculture industry, including green-lipped mussels."},
  {lat: -3.0, lng: 15.0, dataType: "acidification", pH_2000: 8.11, pH_2025: 8.06, acidity_increase_percent: 12, region: "Congo River Plume", label: "The Congo's massive outflow influences the chemistry of the tropical Atlantic, causing a localized pH drop from ~8.11 to ~8.06 (+12% acidity) that can affect local marine life."},
  {lat: 38.0, lng: -76.0, dataType: "acidification", pH_2000: 8.08, pH_2025: 8.02, acidity_increase_percent: 15, region: "Chesapeake Bay, USA", label: "The bay's pH has dropped from ~8.08 to ~8.02 (+15% acidity) due to a double threat: CO₂ from the atmosphere and nutrient runoff from land, endangering its iconic blue crabs and oysters."}
];


// --- MAIN COMPONENT ---
export default function Part5() {
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showPresent, setShowPresent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(0);
  const navigate = useNavigate();
  
  const globeEl = useRef();
  const chatEndRef = useRef();

  // Globe initial position
  useEffect(() => {
    if (globeLoaded && globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 4000);
    }
  }, [globeLoaded]);

  // Pulse animation for ice melt
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process data for visualization with LARGER SIZES
  const visualData = useMemo(() => {
    return oceanData.map(point => {
      let color, size, altitude;
      const value = showPresent ? (point.rate_2025_mm_yr || point.value_2025_Gt_yr || (8.12 - point.pH_2025)) : (point.rate_2000_mm_yr || point.value_2000_Gt_yr || (8.12 - point.pH_2000));
      
      if (point.dataType === 'seaLevelRise') {
        const intensity = (showPresent ? point.rate_2025_mm_yr : point.rate_2000_mm_yr) / 13.5;
        color = `rgba(0, 150, 255, ${0.7 + intensity * 0.3})`;
        size = 0.5 + intensity * 1.0; // INCREASED BASE SIZE
        altitude = 0.02 + intensity * 0.05;
      } else if (point.dataType === 'iceMelt') {
        const intensity = (showPresent ? point.value_2025_Gt_yr : point.value_2000_Gt_yr) / 270;
        const pulse = Math.sin(pulseAnimation * 0.1) * 0.3 + 0.7;
        color = `rgba(255, 255, 255, ${(0.8 + intensity * 0.2) * pulse})`; // INCREASED OPACITY
        size = 0.6 + intensity * 1.2; // INCREASED BASE SIZE
        altitude = 0.03 + intensity * 0.08;
      } else if (point.dataType === 'acidification') {
        const intensity = (showPresent ? (8.12 - point.pH_2025) : (8.12 - point.pH_2000)) / 0.12;
        color = `rgba(255, 87, 34, ${0.7 + intensity * 0.3})`;
        size = 0.5 + intensity * 1.0; // INCREASED BASE SIZE
        altitude = 0.025 + intensity * 0.04;
      }
      
      return { ...point, color, size, altitude, value };
    });
  }, [showPresent, pulseAnimation]);

  // Handle point click
  const handlePointClick = (point) => {
    setSelectedHotspot(point);
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1000);
    }
  };

  // AI Chat handler
  const handleSend = async (question) => {
    if (!question.trim() || isGenerating) return;
    
    const userMessage = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    
    const pageContext = "Part 5: Human Impact on Oceans - visualizing sea level rise, ice melt, and ocean acidification from 2000-2025";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
    
    const body = {
      contents: [{
        parts: [{
          text: `Context: You are an AI assistant for the Blue Orbit ocean visualization project. The user is currently on: ${pageContext}. Answer concisely and scientifically. Question: ${question}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 250,
      }
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error Response:", data);
        const errorMessage = data?.error?.message || "An unknown API error occurred.";
        throw new Error(errorMessage);
      }
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      let aiMessage;
      if (aiResponse) {
        aiMessage = { sender: 'ai', text: aiResponse };
      } else {
        console.error("Invalid response structure from API. Full response:", data);
        const blockReason = data.promptFeedback?.blockReason;
        if (blockReason) {
          aiMessage = { sender: 'ai', text: `My response was blocked. Reason: ${blockReason}. Please try a different question.` };
        } else {
          aiMessage = { sender: 'ai', text: `Sorry, I received an unexpected response from the API.` };
        }
      }
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI request failed:", error);
      const aiMessage = { sender: 'ai', text: `Sorry, an error occurred: ${error.message}` };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDataValueText = (point) => {
    if (!point) return '';
    if (point.dataType === 'seaLevelRise') {
      return (
        <div>
          <div><strong>Rate {showPresent ? '2025' : '2000'}:</strong> {showPresent ? point.rate_2025_mm_yr : point.rate_2000_mm_yr} mm/yr</div>
          <div><strong>Total Rise:</strong> +{point.total_rise_since_2000_mm}mm since 2000</div>
        </div>
      );
    } else if (point.dataType === 'iceMelt') {
      return (
        <div>
          <div><strong>Ice Loss {showPresent ? '2025' : '2000'}:</strong> {showPresent ? point.value_2025_Gt_yr : point.value_2000_Gt_yr} Gt/year</div>
        </div>
      );
    } else if (point.dataType === 'acidification') {
      return (
        <div>
          <div><strong>pH {showPresent ? '2025' : '2000'}:</strong> {showPresent ? point.pH_2025 : point.pH_2000}</div>
          <div><strong>Acidity Increase:</strong> +{point.acidity_increase_percent}% since 2000</div>
        </div>
      );
    }
    return '';
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Globe */}
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={visualData}
        pointAltitude="altitude"
        pointColor="color"
        pointRadius="size"
        pointLabel={d => `<div style="background: rgba(0,0,0,0.9); padding: 10px; border-radius: 8px; max-width: 200px;">
          <strong>${d.region}</strong><br/>
          ${d.label}
        </div>`}
        onPointClick={handlePointClick}
        onGlobeReady={() => setGlobeLoaded(true)}
        atmosphereColor="rgba(100, 150, 255, 0.5)"
        atmosphereAltitude={0.15}
      />

      {/* Info Panel */}
      {selectedHotspot && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '340px',
          padding: '25px',
          ...(window.innerWidth <= 768 ? {
            width: 'calc(100% - 40px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            right: 'auto',
            bottom: 'auto',
            maxHeight: '90vh',
            padding: '20px',
            overflowY: 'auto',
          } : {}),
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
          borderRadius: '15px',
          color: 'white',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#4fc3f7' }}>
            {selectedHotspot.region}
          </h3>
          <div style={{ margin: '10px 0', fontSize: '16px', fontWeight: 'bold', color: '#ffeb3b' }}>
            {getDataValueText(selectedHotspot)}
          </div>
          <p style={{ margin: '15px 0', fontSize: '14px', lineHeight: '1.5', color: '#f3f3f3ff' }}>
            {selectedHotspot.label}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => {
                setChatOpen(true);
                const question = `Why is ${selectedHotspot.dataType === 'seaLevelRise' ? 'sea level rise' : selectedHotspot.dataType === 'iceMelt' ? 'ice melt' : 'ocean acidification'} severe in ${selectedHotspot.region}?`;
                setInputValue(question);
              }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#1976d2',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Ask AI Why
            </button>
            <button
              onClick={() => setSelectedHotspot(null)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={() => navigate('/part6')}
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '15px 40px',
          fontSize: '18px',
          ...(window.innerWidth <= 768 ? {
            top: '20px',
            padding: '10px 25px',
            fontSize: '16px',
          } : {}),
          backgroundColor: 'rgba(34, 197, 94, 0.9)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '30px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(34, 197, 94, 1)';
          e.target.style.transform = 'translateX(-50%) scale(1.05)';
          e.target.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.9)';
          e.target.style.transform = 'translateX(-50%) scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
        }}
      >
        Next: The End →
      </button>

      {/* Time Toggle Button */}
      <button
        onClick={() => setShowPresent(!showPresent)}
        style={{
          position: 'absolute',
          left: '5%',
          padding: '15px 30px',
          bottom: '5%',
          ...(window.innerWidth <= 768 ? {
            bottom: '80px',
            padding: '12px 20px',
            fontSize: '16px',
          } : {}),
          backgroundColor: showPresent ? 'rgba(255, 87, 34, 0.9)' : 'rgba(0, 150, 255, 0.9)',
          border: '2px solid white',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}
      >
        {showPresent ? '← Show 2000 Baseline' : 'Show Human Impact 2025 →'}
      </button>

      {/* AI Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: 'absolute',
            right: '30px',
            bottom: '80px',
            ...(window.innerWidth <= 768 ? {
              bottom: '80px',
              right: '20px',
              width: '56px',
              height: '56px',
            } : {
              width: '60px',
              height: '60px',
            }),
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
            zIndex: 300,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.5)';
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* AI Chat Panel */}
      {chatOpen && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '380px',
          height: '500px',
          ...(window.innerWidth <= 768 ? {
            width: '90%',
            height: '600px',
            right: 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
          } : {}),
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out',
          zIndex: 300,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
              AI Assistant
            </span>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.length === 0 && (
              <div style={{
                color: '#94a3b8',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '40px',
                lineHeight: '1.6',
              }}>
                Ask me anything about ocean changes, sea level rise, ice melt, or acidification!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.sender === 'user' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                {msg.text}
              </div>
            ))}
            {isGenerating && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '14px',
              }}>
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder="Ask a question..."
              disabled={isGenerating}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isGenerating || !inputValue.trim()}
              style={{
                padding: '12px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                cursor: isGenerating || !inputValue.trim() ? 'not-allowed' : 'pointer',
                opacity: isGenerating || !inputValue.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isGenerating && inputValue.trim()) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
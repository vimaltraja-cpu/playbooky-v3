# Add Activity Card

| Field | Value |
| --- | --- |
| Status | Approved |
| Component | Add Activity Card |
| Owner | Design System |
| Version | 1.0.0 |

---

# Design Intent

The Add Activity Card is the final action slot in an Activity Grid.

It uses the same footprint as an Activity Card so the grid remains visually balanced.

It should feel lightweight, calm and intentional.

It is an action card, not a content card.

---

# Purpose

Allows the user to add another activity to the workshop or grid.

---

# Layout

## Card

Width: 256px  
Height: 370px  
Padding: 8px  
Gap: 16px  

Display:

- flex
- column
- centre aligned horizontally
- centre aligned vertically

Background: #FCFBF9  
Border Radius: 16px  

---

# Content Block

Width: 240px  
Height: 76px  
Padding bottom: 8px  
Gap: 8px  

Alignment:

- centre horizontally
- centre vertically

---

# Featured Icon

Width: 40px  
Height: 40px  

Background: #F4F2EF  
Border: 6px solid #FCFBFA  
Border Radius: 28px  

---

# Plus Icon

Width: 20px  
Height: 20px  

Positioned centred inside the featured icon.

---

# Label

Text:

Add activity

Typography:

Geist  
14px  
600  
20px line-height  
Text align: center  

Gradient:

linear-gradient(45deg, #7D5330 0%, #D99C56 100%)

---

# Behaviour

The Add Activity Card always appears as the final card in the Activity Grid.

There should only be one Add Activity Card per grid.

It is not draggable.

Clicking the Add Activity Card should open the activity picker or activity library flow when that exists.

For now, it may be non-functional or show a placeholder action.

---

# Relationship to Activity Grid

The Add Activity Card:

- Uses the same footprint as Activity Cards.
- Appears as the final grid item.
- Does not contain activity data.
- Does not contain illustration artwork.
- Does not contain metadata.
- Does not contain a drag handle.

---

# Acceptance Criteria

- Card is exactly 256 × 370.
- Card radius is 16px.
- Background is #FCFBF9.
- Content is centred.
- Featured icon is 40 × 40.
- Plus icon is centred.
- Label says “Add activity”.
- Label uses Geist 14px / 20px semibold.
- Label uses the approved gold gradient.
- Card appears as the final item in the grid.
- Card is not draggable.
- No activity metadata appears.
- No illustration appears.
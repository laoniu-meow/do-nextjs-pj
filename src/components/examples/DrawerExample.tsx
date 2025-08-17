"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import MenuItemList from "@/components/ui/MenuItemList";

export function DrawerExample() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Drawer Component Examples</h1>

      {/* Basic Left Drawer */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Left Drawer</h2>
        <Drawer position="left" size="md">
          <Drawer.Trigger>Open Left Drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <h3>Navigation Menu</h3>
            </Drawer.Header>
            <Drawer.Body>
              <MenuItemList />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>

      {/* Right Drawer with Custom Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Right Drawer with Custom Content
        </h2>
        <Drawer position="right" size="lg">
          <Drawer.Trigger>Open Right Drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <h3>Settings Panel</h3>
            </Drawer.Header>
            <Drawer.Body>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Theme
                  </label>
                  <select className="w-full p-2 border rounded">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Language
                  </label>
                  <select className="w-full p-2 border rounded">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Settings
              </button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>

      {/* Bottom Drawer for Mobile */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Bottom Drawer (Mobile Friendly)
        </h2>
        <Drawer position="bottom" size="lg">
          <Drawer.Trigger>Open Bottom Drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <h3>Quick Actions</h3>
            </Drawer.Header>
            <Drawer.Body>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-sm">New Post</div>
                  </div>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm">Analytics</div>
                  </div>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="text-sm">Settings</div>
                  </div>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm">Users</div>
                  </div>
                </button>
              </div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>

      {/* Full Screen Drawer */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Full Screen Drawer</h2>
        <Drawer position="left" size="full">
          <Drawer.Trigger>Open Full Screen</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <h3>Full Screen Navigation</h3>
            </Drawer.Header>
            <Drawer.Body>
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <MenuItemList />
                </div>
                <div className="mt-auto p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    This is a full-screen drawer with navigation and footer
                    content.
                  </p>
                </div>
              </div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>

      {/* Drawer with Custom Trigger */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Custom Trigger Button</h2>
        <Drawer position="right" size="md">
          <Drawer.Trigger asChild>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              🎨 Custom Button
            </button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <h3>Custom Trigger Example</h3>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                This drawer was opened using a custom button as the trigger.
              </p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
    </div>
  );
}

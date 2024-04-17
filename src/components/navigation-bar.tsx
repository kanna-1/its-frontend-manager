"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { School } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const PAGE_ROUTES = {
  STUDENT: [{ label: "My Courses", url: "/courses/" }],
  TEACHER: [{ label: "My Courses", url: "/courses/" }],
  ADMIN: [{ label: "User Management", url: "/user-management" }],
};

export default function NavigationBar({
  user,
}: {
  user: User & { school: School };
}): React.JSX.Element {
  return (
    <NavigationMenu>
      <span className="font-semibold text-xl">ITS Management System</span>
      <NavigationMenuList>
        {PAGE_ROUTES[user.role].map((page, index) => (
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href={page.url}
            key={index}
          >
            {page.label}
          </NavigationMenuLink>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p className="text-lg">Account Overview</p>
              <p className="font-light">{user.school.name}</p>
              <p className="font-light">Type: {user.role}</p>
              <p className="font-light">Email: {user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
